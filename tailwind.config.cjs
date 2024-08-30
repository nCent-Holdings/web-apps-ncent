/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require('@ncent-holdings/ux-components/config/tailwind.config.cjs')],
  content: ['./src/**/*.{html,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      animation: {
        'fade-in': 'fadeIn',
        'fade-out': 'fadeOut',
      },
      keyframes: () => ({
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        fadeOut: {
          '0%': { opacity: 1 },
          '100%': { opacity: 0 },
        },
      }),
      colors: {
        'com-leftnav-menu': 'rgba(251,253,255,.8)',
        black: {
          dark: '#000000',
          light: '#16181C',
          'light-soft': '#272B32',
        },
        blue: {
          water: '#E3EDF7',
          lightShade: '#F4F9FF',
          nightShade: '#6D7A93',
          sky: '#D1E9FF',
          'light-suede': '#C1DBEA',
          'medium-suede': '#84ADC7',
          dark: '#0071F1',
          web: '#0047BA',
        },
        grey: {
          500: '#394A64',
          light: {
            900: '#101828',
            500: '#667085',
            400: '#98A2B3',
            200: '#DDE2EC',
            50: '#F2F6FA',
            25: '#F9FBFD',
          },
        },
        lavender: {
          web: 'rgba(230,238,250,0.75)',
        },
        yellow: {
          incomplete: '#e99a00',
          dark: '#805400',
        },
        green: {
          success: {
            DEFAULT: '#027A48',
            50: '#ECFDF3',
          },
        },
        white: {
          light: '#FFFFFF',
          soft: '#F8FCFF',
          softer: '#F8FCFF',
          'soft-light': '#F8FCFF',
        },
        alert: {
          'error-light': '#D33F00',
          error: '#dc4200',
          'issue-light': '#FFC045',
          'issue-medium': '#FFA800',
          issue: '#ffaa05',
          'ok-light': '#00B047',
          'ok-medium': '#00B047',
          ok: '#008435',
        },
      },
      borderRadius: {
        menuSelected: '0px 8px 8px 0px',
      },
      transitionProperty: {
        width: 'width',
        height: 'height',
      },
      listStyleType: {
        none: 'none',
        disc: 'disc',
        decimal: 'decimal',
        square: 'square',
      },
      fontWeight: {
        light: 300,
      },
      boxShadow: {
        'com-input-codes': '0px 1px 2px rgba(16, 24, 40, 0.05), 0px 0px 0px 4px #DFE6FF',
        'active-nav': 'inset 0.5px -0.5px 0.5px #FFFFFF, inset -0.5px 0.5px 3px #AEB7BA',
        'inactive-nav':
          '-7px -7px 12px rgba(255, 255, 255, 0.5), -5px -5px 15px rgba(255, 255, 255, 0.8), 2px 5px 10px rgba(206, 218, 227, 0.75)',
        dropdown: '0px 2px 5px rgba(0, 0, 0, 0.07);',
        'icon-circle':
          '-7px -7px 12px rgba(255, 255, 255, 0.35), -5px -5px 15px rgba(255, 255, 255, 0.8), 2px 5px 10px #CEDAE3;',
        'com-device-normal-circle': ' inset 0 0 0 1.5px #427596',
        'icon-xmark':
          '0px 0px 0px 0px rgba(122, 132, 168, 0.10), 0px 1px 2px 0px rgba(122, 132, 168, 0.10), 2px 3px 3px 0px rgba(122, 132, 168, 0.09), 4px 6px 4px 0px rgba(122, 132, 168, 0.05), 8px 10px 5px 0px rgba(122, 132, 168, 0.01), 12px 16px 6px 0px rgba(122, 132, 168, 0.00)',
        'icon-mode-active':
          '0px 0px 0px 0px rgba(60, 98, 154, 0.16), 0px 2px 4px 0px rgba(60, 98, 154, 0.16), 0px 7px 7px 0px rgba(60, 98, 154, 0.14), 0px 15px 9px 0px rgba(60, 98, 154, 0.08), 0px 26px 11px 0px rgba(60, 98, 154, 0.02), 0px 41px 12px 0px rgba(60, 98, 154, 0.00)',
        'icon-edit-active':
          '0px 0px 0px 0px rgba(27, 50, 95, 0.12), 0px 3px 7px 0px rgba(27, 50, 95, 0.12), 0px 12px 12px 0px rgba(27, 50, 95, 0.10), 0px 28px 17px 0px rgba(27, 50, 95, 0.06), 0px 50px 20px 0px rgba(27, 50, 95, 0.02), 0px 78px 22px 0px rgba(27, 50, 95, 0.00)',
        'dropdown-sites': '-8px 0px 8px rgba(244, 248, 251, 0.50254), 7px 7px 20px rgba(176, 195, 210, 0.45);',
        'com-leftnav': '12px 12px 33px rgba(176, 195, 210, 0.15)',
        'com-leftnav-menu-shadow': '0px 4px 4px rgba(0, 0, 0, 0.25)',
        'com-navitem':
          '0 0 0 1px #F3FAFC, -7px -7px 12px rgba(255, 255, 255, 0.5), -5px -5px 15px rgba(255, 255, 255, 0.8), 2px 5px 10px rgba(206, 218, 227, 0.75);',
        'com-navitem-inset': 'inset 0.5px -0.5px 0.5px #FFFFFF, inset -0.5px 0.5px 3px #AEB7BA;',
        'com-button-navbar-icon-active': 'inset 0.5px -0.5px 0.5px #FFFFFF, inset -0.5px 0.5px 3px #AEB7BA',
        'com-table':
          '0px 0px 0px 0px rgba(178, 196, 210, 0.14), 0px 11px 23px 0px rgba(178, 196, 210, 0.14), 0px 42px 42px 0px rgba(178, 196, 210, 0.12), 0px 95px 57px 0px rgba(178, 196, 210, 0.07), 0px 168px 67px 0px rgba(178, 196, 210, 0.02), 0px 263px 74px 0px rgba(178, 196, 210, 0.00)',
        'com-tab-container':
          '0px 0px 0px 0px rgba(151, 176, 196, 0.12), 0px 2px 5px 0px rgba(151, 176, 196, 0.11), 0px 9px 9px 0px rgba(151, 176, 196, 0.10), 0px 21px 13px 0px rgba(151, 176, 196, 0.06), 0px 37px 15px 0px rgba(151, 176, 196, 0.02), 0px 58px 16px 0px rgba(151, 176, 196, 0.00)',
        'com-tab-selected':
          '0px 0px 0px 0px rgba(27, 50, 95, 0.12), 0px 3px 7px 0px rgba(27, 50, 95, 0.12), 0px 12px 12px 0px rgba(27, 50, 95, 0.10), 0px 28px 17px 0px rgba(27, 50, 95, 0.06), 0px 50px 20px 0px rgba(27, 50, 95, 0.02), 0px 78px 22px 0px rgba(27, 50, 95, 0.00)',
        'mode-button':
          '0px 0px 0px 0px rgba(60, 98, 154, 0.16), 0px 2.1px 4.2px 0px rgba(60, 98, 154, 0.16), 0px 7.35px 7.35px 0px rgba(60, 98, 154, 0.14), 0px 15.75px 9.45px 0px rgba(60, 98, 154, 0.08), 0px 27.3px 11.55px 0px rgba(60, 98, 154, 0.02), 0px 43.05px 12.6px 0px rgba(60, 98, 154, 0.00);',
        'com-toggle':
          ' 0px 0px 0px 0px rgba(121, 153, 204, 0.70), 0px 0px 0.86022px 0px rgba(121, 153, 204, 0.69), 0.86022px 1.72043px 1.72043px 0px rgba(121, 153, 204, 0.60), 2.58065px 3.44086px 2.58065px 0px rgba(121, 153, 204, 0.35), 5.16129px 6.88172px 3.44086px 0px rgba(121, 153, 204, 0.10), 7.74194px 10.32258px 3.44086px 0px rgba(121, 153, 204, 0.01)',
        'com-tooltip-shadow':
          ' 0px 0px 0px 0px rgba(27, 50, 95, 0.25), 0px 10px 23px 0px rgba(27, 50, 95, 0.24), 0px 41px 41px 0px rgba(27, 50, 95, 0.21), 0px 93px 56px 0px rgba(27, 50, 95, 0.12), 0px 165px 66px 0px rgba(27, 50, 95, 0.04), 0px 258px 72px 0px rgba(27, 50, 95, 0.00)',
      },
      fontSize: {
        base: [
          '14px',
          {
            fontWeight: '600',
            lineHeight: '150%',
            letterSpacing: '-0.01em',
          },
        ],
        caption: [
          '16px',
          {
            fontWeight: '400',
            lineHeight: '125%',
            letterSpacing: '-1px',
          },
        ],
        mini: [
          '0.75rem',
          {
            fontWeight: '500',
            fontSize: '0.75rem',
            lineHeight: '125%',
          },
        ],
        tab: [
          '12px',
          {
            fontWeight: '500',
            fontSize: '12px',
            lineHeight: '150%',
          },
        ],
      },
    },
  },
  plugins: [
    function ({ addVariant }) {
      addVariant('initial', 'html :where(&)');
      addVariant('leftnav-collapsed', '[data-left-nav="collapsed"] &');
      addVariant('leftnav-expanded', '[data-left-nav="expanded"] &');
      addVariant('leftnav-overlay', '[data-left-nav="overlay"] &');
      addVariant('topnav-visible', '[data-top-nav="visible"] &');
      addVariant('topnav-hidden', '[data-top-nav="hidden"] &');
      addVariant('rightpanel-hidden', '[data-right-panel="hidden"] &');
      addVariant('rightpanel-visible', '[data-right-panel="visible"] &');
      addVariant('supports-scrollbars', '@supports selector(::-webkit-scrollbar)');
      addVariant('scrollbar', '&::-webkit-scrollbar');
      addVariant('scrollbar-track', '&::-webkit-scrollbar-track');
      addVariant('scrollbar-thumb', '&::-webkit-scrollbar-thumb');
      addVariant('scrollbar-corner', '&::-webkit-scrollbar-corner');
      addVariant('leftnav-item-selected', [
        '[data-page="Notifications"] :where([data-navitem="Notifications"]) &',
        '[data-page="Delos users"] :where([data-navitem="Delos users"]) &',
        '[data-page="Partners"] :where([data-navitem="Partners"]) &',
        '[data-page="Organizations"] :where([data-navitem="Client organizations"]) &',
        '[data-page="Home"] :where([data-navitem="Home"]) &',
        '[data-page="Devices"] :where([data-navitem="Devices"]) &',
        '[data-page="Reporting"] :where([data-navitem="Reporting"]) &',
        '[data-page="System design"] :where([data-navitem="System design"]) &',
        '[data-page="Control center"] :where([data-navitem="Control center"]) &',
        '[data-page="Organization"] :where([data-navitem="Organization"]) &',
        '[data-page="Users"] :where([data-navitem="Users"]) &',
        '[data-page="API key"] :where([data-navitem="API key"]) &',
      ]);
    },
  ],
};
