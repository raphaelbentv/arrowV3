import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/authContext';

const DRAWER_WIDTH = 280;
const DRAWER_WIDTH_COLLAPSED = 70;

interface MenuItem {
  title: string;
  icon: React.ReactElement;
  path?: string;
  role?: string[];
  children?: MenuItem[];
}

const Sidebar: React.FC = () => {
  const [open, setOpen] = useState(true);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const menuItems: MenuItem[] = [
    {
      title: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/admin',
      role: ['admin', 'intervenant'],
    },
    {
      title: 'Cohortes',
      icon: <SchoolIcon />,
      role: ['admin'],
      children: [
        { title: 'Liste des cohortes', icon: <ClassIcon />, path: '/admin/cohortes' },
        { title: 'Nouvelle cohorte', icon: <PersonAddIcon />, path: '/admin/cohortes/new' },
      ],
    },
    {
      title: 'Étudiants',
      icon: <PeopleIcon />,
      path: '/admin/etudiants',
      role: ['admin'],
    },
    {
      title: 'Intervenants',
      icon: <PersonAddIcon />,
      path: '/admin/intervenants',
      role: ['admin'],
    },
    {
      title: 'Planning',
      icon: <CalendarIcon />,
      path: '/admin/planning',
      role: ['admin', 'intervenant'],
    },
    {
      title: 'Présences',
      icon: <AssignmentIcon />,
      path: '/admin/presences',
      role: ['admin', 'intervenant'],
    },
    {
      title: 'Évaluations',
      icon: <BarChartIcon />,
      path: '/admin/evaluations',
      role: ['admin', 'intervenant'],
    },
    {
      title: 'Paramètres',
      icon: <SettingsIcon />,
      path: '/admin/settings',
      role: ['admin'],
    },
  ];

  const toggleDrawer = () => {
    setOpen(!open);
    if (!open) {
      setExpandedItems([]);
    }
  };

  const handleExpandClick = (title: string) => {
    setExpandedItems((prev) =>
      prev.includes(title) ? prev.filter((item) => item !== title) : [...prev, title]
    );
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path?: string) => {
    if (!path) return false;
    return location.pathname === path;
  };

  const renderMenuItem = (item: MenuItem) => {
    // Vérifier le rôle
    if (item.role && !item.role.includes(user?.role || '')) {
      return null;
    }

    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.title);
    const active = isActive(item.path);

    if (hasChildren) {
      return (
        <React.Fragment key={item.title}>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => handleExpandClick(item.title)}
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
                '&:hover': {
                  backgroundColor: 'rgba(255, 215, 0, 0.08)',
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                  color: 'text.label',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.title}
                sx={{
                  opacity: open ? 1 : 0,
                  color: 'text.secondary',
                }}
              />
              {open && (isExpanded ? <ExpandLess /> : <ExpandMore />)}
            </ListItemButton>
          </ListItem>
          {open && (
            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {item.children?.map((child) => (
                  <ListItem key={child.title} disablePadding>
                    <ListItemButton
                      onClick={() => child.path && handleNavigation(child.path)}
                      sx={{
                        pl: 4,
                        backgroundColor: isActive(child.path)
                          ? 'rgba(255, 215, 0, 0.15)'
                          : 'transparent',
                        borderLeft: isActive(child.path)
                          ? '3px solid #FFD700'
                          : '3px solid transparent',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 215, 0, 0.08)',
                        },
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: 2,
                          justifyContent: 'center',
                          color: isActive(child.path) ? 'primary.main' : 'text.label',
                        }}
                      >
                        {child.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={child.title}
                        sx={{
                          color: isActive(child.path) ? 'primary.main' : 'text.secondary',
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Collapse>
          )}
        </React.Fragment>
      );
    }

    return (
      <ListItem key={item.title} disablePadding>
        <ListItemButton
          onClick={() => item.path && handleNavigation(item.path)}
          sx={{
            minHeight: 48,
            justifyContent: open ? 'initial' : 'center',
            px: 2.5,
            backgroundColor: active ? 'rgba(255, 215, 0, 0.15)' : 'transparent',
            borderLeft: active ? '3px solid #FFD700' : '3px solid transparent',
            '&:hover': {
              backgroundColor: 'rgba(255, 215, 0, 0.08)',
            },
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: open ? 3 : 'auto',
              justifyContent: 'center',
              color: active ? 'primary.main' : 'text.label',
            }}
          >
            {item.icon}
          </ListItemIcon>
          <ListItemText
            primary={item.title}
            sx={{
              opacity: open ? 1 : 0,
              color: active ? 'primary.main' : 'text.secondary',
            }}
          />
        </ListItemButton>
      </ListItem>
    );
  };

  return (
    <Drawer
      variant="permanent"
      open={open}
      sx={{
        width: open ? DRAWER_WIDTH : DRAWER_WIDTH_COLLAPSED,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        '& .MuiDrawer-paper': {
          width: open ? DRAWER_WIDTH : DRAWER_WIDTH_COLLAPSED,
          transition: (theme) =>
            theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          overflowX: 'hidden',
          backgroundColor: 'background.menu',
          borderRight: '1px solid rgba(255, 255, 255, 0.05)',
        },
      }}
    >
      {/* Header avec logo et bouton toggle */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: open ? 'space-between' : 'center',
          px: open ? 2 : 1,
          py: 2,
          minHeight: 64,
        }}
      >
        {open && (
          <Typography
            variant="h5"
            sx={{
              fontWeight: 900,
              background: 'linear-gradient(45deg, #FFD700, #FFA500)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            ArroW
          </Typography>
        )}
        <IconButton onClick={toggleDrawer} sx={{ color: 'primary.main' }}>
          {open ? <ChevronLeftIcon /> : <MenuIcon />}
        </IconButton>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.05)' }} />

      {/* Menu Items */}
      <List sx={{ mt: 1 }}>{menuItems.map(renderMenuItem)}</List>

      {/* Spacer pour pousser logout en bas */}
      <Box sx={{ flexGrow: 1 }} />

      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.05)' }} />

      {/* Logout */}
      <List>
        <ListItem disablePadding>
          <ListItemButton
            onClick={handleLogout}
            sx={{
              minHeight: 48,
              justifyContent: open ? 'initial' : 'center',
              px: 2.5,
              '&:hover': {
                backgroundColor: 'rgba(255, 68, 68, 0.1)',
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: open ? 3 : 'auto',
                justifyContent: 'center',
                color: 'error.main',
              }}
            >
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText
              primary="Déconnexion"
              sx={{
                opacity: open ? 1 : 0,
                color: 'error.main',
              }}
            />
          </ListItemButton>
        </ListItem>
      </List>

      {/* User info en bas */}
      {open && user && (
        <Box
          sx={{
            p: 2,
            backgroundColor: 'rgba(255, 215, 0, 0.05)',
            borderTop: '1px solid rgba(255, 215, 0, 0.1)',
          }}
        >
          <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
            {user.firstName} {user.lastName}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.label' }}>
            {user.role === 'admin' ? 'Administrateur' : 'Intervenant'}
          </Typography>
        </Box>
      )}
    </Drawer>
  );
};

export default Sidebar;