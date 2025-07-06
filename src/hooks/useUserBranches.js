import { useState, useEffect } from "react";
import api from "../api/endpoints";

const useUserBranches = () => {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBranches = async () => {
    try {
      setLoading(true);
      setError(null);

      // Obtener sucursales con opción "Todas"
      const response = await api.branchs.my_branches_for_filters();
      setBranches(response.data || []);
    } catch (err) {

      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  const getBranchById = (branchId) => {
    if (branchId === "all") {
      return {
        id: "all",
        business_name: "Todas mis sucursales",
        is_all_option: true,
      };
    }
    return branches.find((branch) => branch.id === branchId);
  };

  const getBranchIds = () => {
    return branches
      .filter((branch) => !branch.is_all_option)
      .map((branch) => branch.id);
  };

  const isAllBranches = (branchId) => {
    return branchId === "all";
  };

  return {
    branches,
    loading,
    error,
    refetch: fetchBranches,
    getBranchById,
    getBranchIds,
    isAllBranches,
  };
};

export default useUserBranches;
