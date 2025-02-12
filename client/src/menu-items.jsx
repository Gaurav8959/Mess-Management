const menuItems = {
  items: [
    {
      id: 'navigation',
      title: 'Navigation',
      type: 'group',
      icon: 'icon-navigation',
      children: [
        {
          id: 'dashboard',
          title: 'Dashboard',
          type: 'item',
          icon: 'feather icon-home',
          url: '/app/dashboard'
        }
      ]
    },
    {
      id: 'students',
      title: 'STUDENTS',
      type: 'group',
      icon: 'icon-navigation',
      children: [
        {
          id: 'student',
          title: 'Students',
          type: 'item',
          icon: 'feather icon-user-plus',
          url: '/app/student'
        }
      ]
    },
    {
      id: 'cards',
      title: 'CARDS',
      type: 'group',
      icon: 'icon-navigation',
      children: [
        {
          id: 'card',
          title: 'Cards',
          type: 'item',
          icon: 'feather icon-credit-card',
          url: '/app/card'
        }
      ]
    },
    {
      id: 'expenses',
      title: 'EXPENSES',
      type: 'group',
      icon: 'icon-money',
      children: [
        {
          id: 'expenses',
          title: 'Expenses',
          type: 'item',
          icon: 'feather icon-trending-up',
          url: '/app/expenses'
        }
      ]
    },
    {
      id: 'staff',
      title: 'STAFF',
      type: 'group',
      icon: 'icon-ui',
      children: [
        {
          id: 'staff',
          title: 'Staff',
          type: 'collapse',
          icon: 'feather icon-users',
          children: [
            {
              id: 'staffs',
              title: 'Staff',
              type: 'item',
              url: '/app/staff'
            },
            {
              id: 'salary',
              title: 'Salary',
              type: 'item',
              url: '/app/salary'
            }
          ]
        }
      ]
    },

    {
      id: 'pages',
      title: 'Pages',
      type: 'group',
      icon: 'icon-pages',
      children: [
        {
          id: 'disabled-menu',
          title: 'Disabled Menu',
          type: 'item',
          url: '#',
          classes: 'nav-item disabled',
          icon: 'feather icon-power'
        }
      ]
    }
  ]
};

export default menuItems;
