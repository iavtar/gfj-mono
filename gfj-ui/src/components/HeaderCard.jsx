import React from "react";
import { useSelector } from "react-redux";
import { Card, CardContent, Typography } from "@mui/material";

const HeaderCard = ({ icon, title, description, color="blue" }) => {
  const isMobile = useSelector((state) => state.user.isMobile);
  if (isMobile) {
    return (
      <div className="flex-shrink-0 mb-4">
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
        <div className="flex items-center gap-2 mb">
          <div className={`w-12 h-12 bg-${color}-600 rounded-lg flex items-center justify-center shadow-md`}>
            <span className="text-2xl text-white">{icon}</span>
          </div>
          <div>
            <h1 className="text-xl pl-2 font-bold text-gray-900">
              {title}
            </h1>
          </div>
        </div>
      </div>
    </div>
    );
  }

  return (
    <div className="flex-shrink-0 mb-6">
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="flex items-center gap-4 mb-4">
          <div className={`w-12 h-12 bg-${color}-600 rounded-lg flex items-center justify-center shadow-md`}>
            <span className="text-2xl text-white">{icon}</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {title}
            </h1>
            {description && <p className="text-gray-600 mt-1">{description}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderCard;
