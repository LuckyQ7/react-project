import React, { useEffect } from "react";
import { NavBar } from "antd-mobile";
import { useNavigate } from "react-router-dom";
import PropType from "prop-types";
export default function NavHeader({ children, navBar, rightContent, type }) {
  const navigate = useNavigate();
  useEffect(() => {
    if (type === "rentAdd") {
      const iconR = document.querySelector(".icon-add");
      iconR.addEventListener("click", () => {
        navigate("/renter/add");
      });
    }
  });
  return (
    <NavBar
      mode="light"
      icon={<i className="iconfont icon-back" />}
      onLeftClick={() => navigate("/Home")}
      className={[navBar || ""].join(" ")}
      rightContent={rightContent}
    >
      {children}
    </NavBar>
  );
}

NavHeader.propTypes = {
  children: PropType.string.isRequired,
  navBar: PropType.string,
  rightContent: PropType.element,
  type: PropType.string,
};
