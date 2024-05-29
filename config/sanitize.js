const e = require("express");

// sanitize.js
const sanitizeInput = (data) => {
    const sanitizeString = (str) => {
        if (typeof str !== 'string') return str;
        return str.trim().replace(/[&<>"'/]/g, function (s) {
            const entityMap = {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;',
                '/': '&#x2F;'
            };
            return entityMap[s];
        });
    };

    if (Array.isArray(data)) {
        return data.map(sanitizeInput);
    } else if (typeof data === 'object' && data !== null) {
        const sanitizedObject = {};
        for (const key in data) {
            sanitizedObject[key] = sanitizeInput(data[key]);
        }
        return sanitizedObject;
    } else if (typeof data === 'string') {
        return sanitizeString(data);
    }

    return data;
};

module.exports = sanitizeInput;
