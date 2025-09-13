import React from "react";
import { Card, Skeleton, Flex, Space, theme } from "antd";

const DashboardSkeleton = ({ isMobile = false }) => {
  const { token } = theme.useToken();

  const cardStyle = {
    background: token.colorBgContainer,
    borderRadius: token.borderRadius,
    boxShadow: token.boxShadowTertiary,
    transition: "all 0.3s ease-in-out",
  };

  const skeletonInputStyle = {
    borderRadius: token.borderRadius,
  };

  return (
    <div 
      style={{ 
        padding: isMobile ? 16 : 24,
        opacity: 0.9,
        transition: "opacity 0.3s ease-in-out"
      }}
    >
      <Flex vertical gap="large">
        {/* Header skeleton */}
        <Card size="small" style={cardStyle}>
          <Flex
            justify="space-between"
            align="center"
            wrap={isMobile ? "wrap" : "nowrap"}
            gap={isMobile ? 8 : 16}
          >
            <div style={{ flex: 1 }}>
              <Skeleton.Input 
                active 
                style={{ 
                  width: isMobile ? 180 : 240, 
                  height: 32,
                  ...skeletonInputStyle
                }} 
              />
              <br />
              <Skeleton.Input 
                active 
                style={{ 
                  width: isMobile ? 140 : 180, 
                  height: 16, 
                  marginTop: 8,
                  ...skeletonInputStyle
                }} 
              />
            </div>
            <Space direction={isMobile ? "vertical" : "horizontal"} size="small">
              <Skeleton.Input 
                active 
                style={{ 
                  width: isMobile ? "100%" : 200, 
                  height: 32,
                  ...skeletonInputStyle
                }} 
              />
              <Skeleton.Input 
                active 
                style={{ 
                  width: isMobile ? "100%" : 250, 
                  height: 32,
                  ...skeletonInputStyle
                }} 
              />
            </Space>
          </Flex>
        </Card>

        {/* Time Series Chart skeleton */}
        <Card style={cardStyle}>
          <Skeleton.Input 
            active 
            style={{ 
              width: isMobile ? 150 : 200, 
              height: 24, 
              marginBottom: 16,
              ...skeletonInputStyle
            }} 
          />
          <Skeleton active paragraph={{ rows: 6 }} />
        </Card>
        
        {/* Branch Performance Chart skeleton */}
        <Card style={cardStyle}>
          <Skeleton.Input 
            active 
            style={{ 
              width: isMobile ? 120 : 160, 
              height: 24, 
              marginBottom: 16,
              ...skeletonInputStyle
            }} 
          />
          <Skeleton active paragraph={{ rows: 4 }} />
        </Card>

        {/* Sales Section skeleton */}
        <Card style={cardStyle}>
          <Skeleton.Input 
            active 
            style={{ 
              width: isMobile ? 100 : 120, 
              height: 24, 
              marginBottom: 16,
              ...skeletonInputStyle
            }} 
          />
          <Flex gap="middle" wrap={isMobile ? "wrap" : "nowrap"}>
            {Array.from({ length: isMobile ? 2 : 4 }).map((_, index) => (
              <div key={index} style={{ flex: 1, minWidth: isMobile ? "45%" : "auto" }}>
                <Card size="small" style={{ ...cardStyle, margin: 0 }}>
                  <Skeleton.Input 
                    active 
                    style={{ 
                      width: "60%", 
                      height: 16, 
                      marginBottom: 8,
                      ...skeletonInputStyle
                    }} 
                  />
                  <Skeleton.Input 
                    active 
                    style={{ 
                      width: "80%", 
                      height: 28,
                      ...skeletonInputStyle
                    }} 
                  />
                </Card>
              </div>
            ))}
          </Flex>
        </Card>

        {/* Orders Section skeleton */}
        <Card style={cardStyle}>
          <Skeleton.Input 
            active 
            style={{ 
              width: isMobile ? 100 : 120, 
              height: 24, 
              marginBottom: 16,
              ...skeletonInputStyle
            }} 
          />
          <Flex gap="middle" wrap={isMobile ? "wrap" : "nowrap"}>
            {Array.from({ length: isMobile ? 2 : 3 }).map((_, index) => (
              <div key={index} style={{ flex: 1, minWidth: isMobile ? "45%" : "auto" }}>
                <Card size="small" style={{ ...cardStyle, margin: 0 }}>
                  <Skeleton.Input 
                    active 
                    style={{ 
                      width: "70%", 
                      height: 16, 
                      marginBottom: 8,
                      ...skeletonInputStyle
                    }} 
                  />
                  <Skeleton.Input 
                    active 
                    style={{ 
                      width: "90%", 
                      height: 28,
                      ...skeletonInputStyle
                    }} 
                  />
                </Card>
              </div>
            ))}
          </Flex>
        </Card>

        {/* Payments & Products skeleton */}
        <Card style={cardStyle}>
          <Skeleton active paragraph={{ rows: 3 }} />
        </Card>
      </Flex>
    </div>
  );
};

export default DashboardSkeleton;