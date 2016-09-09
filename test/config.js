module.exports.globalStyles = [
    "style.css",
    "responsive.css"
];

module.exports.globalScripts = [
    "script.js",
    "jquery.js"
];

module.exports.pageDefinition = [
    {
        url: "/",
        styles: [
          "home.css"
        ],
        scripts: [
          "home.js"
        ]
    },
    {
        url: "/about/team",
        styles: [
          "team.css"
        ],
        scripts: [
          "team.js"
        ]
    },
    {
      url: "/about/team/:",
      styles: [
        "team-member.css"
      ],
      scripts: [
        "team-member.js"
      ]
    }
];


module.exports.sectionDefinition = [
    {
        url: "/about",
        styles: [
          "about.css"
        ],
        scripts: [
          "about.js"
        ]
    }
];
