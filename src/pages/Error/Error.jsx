import React from "react";

export const Error404 = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100%",
        background: "var(--clr-bg-dark)",
      }}
    >
      <h1 style={{ color: "white" }}>404 Not Found</h1>
    </div>
  );
};
