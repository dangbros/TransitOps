import React from "react";

const Footer = () => {
    return (
        <footer className="h-14 bg-gray-900 text-gray-300 flex items-center justify-center">
            <p>
                © {new Date().getFullYear()} Fleet Management System. All rights
                reserved.
            </p>
        </footer>
    );
};

export default Footer;