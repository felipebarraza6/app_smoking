import React, {
  createContext,
  useReducer,
  useMemo,
  useState,
  useContext,
  useEffect,
} from "react";
import { Col, Row } from "antd";
import List from "../components/branchs/List/Component";
import CreateUpdate from "../components/branchs/CreateUpdate/Component";
import UserManagement from "../components/branchs/UserManagement/Component";
import AnimatedContainer from "./AnimatedContainer";
import { branchsReducer } from "../reducers/branchsReducer";
import { defaultGutterRow } from "../utils/layout";
import { AppContext } from "../App";
import api from "../api/endpoints";

export const BranchsContext = createContext();

/**
 * Container principal para la gestión de sucursales.
 * Provee contexto y estado global para la sección de sucursales.
 * Estructura:
 * - state: { list, form, select_to_edit }
 * - dispatch: acciones del reducer branchsReducer
 * Renderiza el listado y el formulario de creación/edición.
 */
const Branchs = () => {
  const initialState = {
    list: {
      results: [],
      count: 0,
      page: 1,
      countUpdate: 0,
    },
    form: {
      region: true,
      province: false,
      commune: false,
      logo: null,
    },
    select_to_edit: null,
  };

  const gutterRow = useMemo(() => defaultGutterRow, []);
  const [state, dispatch] = useReducer(branchsReducer, initialState);

  // Estado para gestión de usuarios
  const [userManagementVisible, setUserManagementVisible] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [userRoles, setUserRoles] = useState({});
  const [canManageBranch, setCanManageBranch] = useState(() => () => false);

  const { state: appState, dispatch: appDispatch } = useContext(AppContext);
  const currentUser = appState.user;
  const isSystemAdmin = currentUser?.type_user === "ADM";

  // Función para determinar si el usuario puede gestionar una sucursal específica
  const checkCanManageBranch = useMemo(() => {
    return (branchId) => {
      // Los administradores del sistema pueden gestionar cualquier sucursal
      if (isSystemAdmin) return true;

      // Verificar si el usuario tiene un rol que le permita gestionar esta sucursal
      const userRole = userRoles[branchId];
      if (!userRole) return false;

      // OWNER, ADMIN, MANAGER pueden gestionar la sucursal
      return ["OWNER", "ADMIN", "MANAGER"].includes(userRole);
    };
  }, [isSystemAdmin, userRoles]);

  // Función para determinar si el usuario puede crear/editar sucursales
  const canCreateOrEdit = useMemo(() => {
    // Los administradores del sistema siempre pueden crear/editar
    if (isSystemAdmin) return true;

    // Verificar si el usuario tiene algún rol de gestión en alguna sucursal
    const hasManagementRole = Object.values(userRoles).some((role) =>
      ["OWNER", "ADMIN", "MANAGER"].includes(role)
    );

    // Si el usuario no tiene sucursales asignadas, permitir crear la primera
    const hasNoBranches = Object.keys(userRoles).length === 0;

    return hasManagementRole || hasNoBranches;
  }, [isSystemAdmin, userRoles]);

  const handleManageUsers = (branch) => {
    setSelectedBranch(branch);
    setUserManagementVisible(true);
  };

  const handleUserManagementClose = () => {
    setUserManagementVisible(false);
    setSelectedBranch(null);
  };

  const handleUserManagementUpdate = () => {
    // Refrescar la lista de sucursales
    loadMyBranches();
  };

  // Función para cargar las tiendas del usuario
  const loadMyBranches = async () => {
    try {
      const response = await api.branchs.my_branches();
      const branches = Array.isArray(response.data) ? response.data : [];

      // Crear un mapa de roles de usuario por sucursal
      const rolesMap = {};
      branches.forEach((branchAccess) => {
        if (branchAccess.branch && branchAccess.role) {
          rolesMap[branchAccess.branch.id] = branchAccess.role;
        }
      });
      setUserRoles(rolesMap);

      appDispatch({ type: "SET_BRANCHES", payload: branches });
      dispatch({
        type: "add",
        payload: {
          results: branches.map((b) => b.branch || b),
          count: branches.length,
        },
      });
    } catch (error) {

      appDispatch({ type: "SET_BRANCHES", payload: [] });
      dispatch({
        type: "add",
        payload: { results: [], count: 0 },
      });
    }
  };

  useEffect(() => {
    // Cargar solo las tiendas asignadas al usuario
    loadMyBranches();
    
    // Escuchar evento personalizado para recargar tiendas
    const handleReloadBranches = () => {
      loadMyBranches();
    };
    
    window.addEventListener('reloadBranches', handleReloadBranches);
    
    return () => {
      window.removeEventListener('reloadBranches', handleReloadBranches);
    };
  }, [appDispatch, dispatch]);

  // Actualizar la función canManageBranch cuando cambien los roles
  useEffect(() => {
    setCanManageBranch(() => checkCanManageBranch);
  }, [checkCanManageBranch]);

  return (
    <AnimatedContainer>
      <BranchsContext.Provider value={{ state, dispatch }}>
        <Row justify={"space-around"} gutter={gutterRow}>
          <Col xl={canCreateOrEdit ? 15 : 24} xs={24}>
            <List
              onManageUsers={handleManageUsers}
              canManageBranch={canManageBranch}
              userRoles={userRoles}
            />
          </Col>
          {canCreateOrEdit && (
            <Col xl={7} xs={24}>
              <CreateUpdate />
            </Col>
          )}
        </Row>

        {/* Modal de gestión de usuarios */}
        <UserManagement
          branch={selectedBranch}
          visible={userManagementVisible}
          onClose={handleUserManagementClose}
          onUpdate={handleUserManagementUpdate}
        />
      </BranchsContext.Provider>
    </AnimatedContainer>
  );
};

export default Branchs;
