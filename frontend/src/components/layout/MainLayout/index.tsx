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
  useTheme
} from '@mui/material';
import { Home, Person, School, Settings, Menu as MenuIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const DRAWER_WIDTH = 240;

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { text: 'Dashboard', icon: <Home />, path: '/' },
    { text: 'Intervenants', icon: <Person />, path: '/intervenants' },
    { text: 'Étudiants', icon: <School />, path: '/etudiants' },
    { text: 'Paramètres', icon: <Settings />, path: '/settings' },
  ];

  const drawer = (
    <Box sx={{ overflow: 'auto', color: 'white' }}>
      <Toolbar /> {/* Espace pour le header */}
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              onClick={() => {
                navigate(item.path);
                if (isMobile) handleDrawerToggle();
              }}
              sx={{
                '&:hover': {
                  bgcolor: 'rgba(255, 215, 0, 0.1)',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'white' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
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