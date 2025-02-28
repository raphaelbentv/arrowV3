import { useState } from 'react';
import { 
  Box, 
  Drawer, 
  List, 
  ListItem,
  ListItemButton,
  ListItemIcon, 
  ListItemText, 
  AppBar, 
  Toolbar, 
  Typography,
  IconButton,
  useMediaQuery,
  useTheme,
  Divider,
  Collapse
} from '@mui/material';
import { 
  Dashboard as DashboardIcon,
  Person as PeopleIcon,
  Settings as SettingsIcon,
  AdminPanelSettings as AdminPanelSettingsIcon,
  Menu as MenuIcon,
  Logout,
  ExpandLess,
  ExpandMore
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/authContext';

const DRAWER_WIDTH = 240;

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const { logout } = useAuth();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    logout();
    navigate('/');
  };

  const mainMenuItems = [
    {
      text: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/admin/dashboard'
    },
    {
      text: 'Intervenants',
      icon: <PeopleIcon />,
      path: '/admin/intervenant-list'
    }
  ];

  const settingsMenuItems = [
    {
      text: 'Administrateurs',
      icon: <AdminPanelSettingsIcon />,
      path: '/admin/administrator-list'
    }
    // Vous pourrez ajouter d'autres éléments de paramètres ici
  ];

  const handleSettingsClick = () => {
    setSettingsOpen(!settingsOpen);
  };

  const isPathActive = (path: string) => location.pathname === path;

  const drawer = (
    <Box sx={{ overflow: 'auto', color: 'white', display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Toolbar /> {/* Espace pour le header */}
      <List>
        {mainMenuItems.map((item) => (
          <ListItemButton
            key={item.text}
            onClick={() => {
              navigate(item.path);
              if (isMobile) handleDrawerToggle();
            }}
            selected={isPathActive(item.path)}
          >
            <ListItemIcon sx={{ color: 'white' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItemButton>
        ))}
      </List>
      <Divider sx={{ my: 1 }} />
      <List>
        <ListItemButton onClick={handleSettingsClick}>
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="Paramètres" />
          {settingsOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
      </List>
      <Collapse in={settingsOpen} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {settingsMenuItems.map((item) => (
            <ListItemButton
              key={item.text}
              sx={{ pl: 4 }}
              onClick={() => {
                navigate(item.path);
                if (isMobile) handleDrawerToggle();
              }}
              selected={isPathActive(item.path)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          ))}
        </List>
      </Collapse>
      <Box sx={{ flexGrow: 1 }} /> {/* Espace flexible */}
      <Divider sx={{ bgcolor: 'rgba(255, 255, 255, 0.12)' }} />
      <List>
        <ListItem disablePadding>
          <ListItemButton
            onClick={handleLogout}
            sx={{
              '&:hover': {
                bgcolor: 'rgba(255, 0, 0, 0.1)',
              },
            }}
          >
            <ListItemIcon sx={{ color: 'error.main' }}>
              <Logout />
            </ListItemIcon>
            <ListItemText primary="Déconnexion" sx={{ color: 'error.main' }} />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: '#252525'
        }}
      >
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" noWrap component="div" sx={{ color: '#FFD700' }}>
            ArroW
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Drawer pour mobile */}
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Meilleure performance sur mobile
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: DRAWER_WIDTH,
              bgcolor: '#252525',
            },
          }}
        >
          {drawer}
        </Drawer>
      ) : (
        // Drawer pour desktop
        <Drawer
          variant="permanent"
          sx={{
            width: DRAWER_WIDTH,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: DRAWER_WIDTH,
              boxSizing: 'border-box',
              bgcolor: '#252525',
            },
          }}
        >
          {drawer}
        </Drawer>
      )}

      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: 3,
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          minHeight: '100vh'
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default MainLayout; 