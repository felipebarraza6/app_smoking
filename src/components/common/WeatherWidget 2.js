import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Alert,
} from "@mui/material";
import { WbSunny, Cloud, Opacity, Air } from "@mui/icons-material";

const WeatherWidget = ({
  city = "Santiago",
  countryCode = "CL",
  className = "",
}) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getWeatherIcon = (iconCode) => {
    if (iconCode?.includes("01"))
      return <WbSunny sx={{ fontSize: 40, color: "#FFD700" }} />;
    if (
      iconCode?.includes("02") ||
      iconCode?.includes("03") ||
      iconCode?.includes("04")
    ) {
      return <Cloud sx={{ fontSize: 40, color: "#87CEEB" }} />;
    }
    return <WbSunny sx={{ fontSize: 40, color: "#FFD700" }} />;
  };

  const getWeatherData = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({ city });
      if (countryCode) params.append("country_code", countryCode);

      const response = await fetch(`/api/shared/weather/current/?${params}`, {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setWeather(data.data);
      } else {
        setError(data.error || "Error al obtener datos del clima");
      }
    } catch (err) {
      console.error("Error obteniendo clima:", err);
      setError("Error al cargar el clima");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getWeatherData();

    // Actualizar cada 30 minutos
    const interval = setInterval(getWeatherData, 30 * 60 * 1000);

    return () => clearInterval(interval);
  }, [city, countryCode]);

  if (loading) {
    return (
      <Card className={className} sx={{ minWidth: 275, textAlign: "center" }}>
        <CardContent>
          <CircularProgress size={40} />
          <Typography variant="body2" sx={{ mt: 1 }}>
            Cargando clima...
          </Typography>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className} sx={{ minWidth: 275 }}>
        <CardContent>
          <Alert severity="error" sx={{ mb: 1 }}>
            {error}
          </Alert>
          <Typography variant="body2" color="text.secondary">
            No se pudo cargar el clima para {city}
          </Typography>
        </CardContent>
      </Card>
    );
  }

  if (!weather) {
    return (
      <Card className={className} sx={{ minWidth: 275 }}>
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            No hay datos disponibles
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className} sx={{ minWidth: 275 }}>
      <CardContent>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={2}
        >
          <Box>
            <Typography variant="h6" component="div">
              {weather.city}, {weather.country}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ textTransform: "capitalize" }}
            >
              {weather.description}
            </Typography>
          </Box>
          {getWeatherIcon(weather.icon)}
        </Box>

        <Box display="flex" alignItems="center" mb={2}>
          <Typography variant="h4" component="div" sx={{ fontWeight: "bold" }}>
            {Math.round(weather.temperature)}°C
          </Typography>
          {weather.feels_like && weather.feels_like !== weather.temperature && (
            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
              Sensación: {Math.round(weather.feels_like)}°C
            </Typography>
          )}
        </Box>

        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center" gap={0.5}>
            <Opacity sx={{ fontSize: 16, color: "#2196F3" }} />
            <Typography variant="body2" color="text.secondary">
              {weather.humidity}%
            </Typography>
          </Box>

          {weather.wind_speed && (
            <Box display="flex" alignItems="center" gap={0.5}>
              <Air sx={{ fontSize: 16, color: "#4CAF50" }} />
              <Typography variant="body2" color="text.secondary">
                {weather.wind_speed} m/s
              </Typography>
            </Box>
          )}
        </Box>

        {weather.pressure && (
          <Typography
            variant="caption"
            color="text.secondary"
            display="block"
            sx={{ mt: 1 }}
          >
            Presión: {weather.pressure} hPa
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default WeatherWidget;
