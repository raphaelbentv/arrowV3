import React from 'react';
import StatCard from '../../components/common/StatCard';
import ActionCard from '../../components/common/ActionCard';

const AdminPanel: React.FC = () => {
  return (
    <Container maxWidth="xl">
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 900,
            mb: 1,
            background: 'linear-gradient(45deg, #FFD700, #FFA500)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Tableau de Bord Administrateur
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.label' }}>
          Vue d'ensemble des indicateurs et des activités
        </Typography>
      </Box>

      {/* Barre de recherche */}
      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          placeholder="Rechercher un intervenant, une formation, un document..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'text.label' }} />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
              },
            },
          }}
        />
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Satisfaction"
            value="92%"
            subtitle="Basé sur 150 retours"
            icon={<TrendingUpIcon />}
            color="#4CAF50"
            progress={92}
            trend={{ value: 5, isPositive: true }}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Taux de Réussite"
            value="88%"
            subtitle="95% de présence"
            icon={<SchoolIcon />}
            color="#2196F3"
            progress={88}
            trend={{ value: 3, isPositive: true }}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Compétences"
            value="85%"
            subtitle="90% de progression"
            icon={<BarChartIcon />}
            color="#9C27B0"
            progress={85}
            trend={{ value: 2, isPositive: false }}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Qualité Intervenants"
            value="98%"
            subtitle="95% à jour"
            icon={<PersonIcon />}
            color="#FF9800"
            progress={98}
            trend={{ value: 1, isPositive: true }}
          />
        </Grid>
      </Grid>

      {/* Actions Rapides */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 900 }}>
          Actions rapides
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <ActionCard
              title="Gestion des Cohortes"
              description="Créer et gérer les cohortes d'étudiants"
              icon={<SchoolIcon />}
              color="#2196F3"
              path="/admin/cohortes"
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <ActionCard
              title="Gestion des Utilisateurs"
              description="Administrer les comptes utilisateurs"
              icon={<PeopleIcon />}
              color="#4CAF50"
              path="/admin/users"
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <ActionCard
              title="Gestion des Intervenants"
              description="Administrer les intervenants et leurs cours"
              icon={<PersonIcon />}
              color="#FF9800"
              path="/admin/intervenants"
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <ActionCard
              title="Planning"
              description="Gérer les emplois du temps"
              icon={<ClassIcon />}
              color="#9C27B0"
              path="/admin/planning"
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <ActionCard
              title="Présences"
              description="Suivi des présences"
              icon={<AssignmentIcon />}
              color="#F44336"
              path="/admin/presences"
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <ActionCard
              title="Évaluations"
              description="Notes et bulletins"
              icon={<BarChartIcon />}
              color="#00BCD4"
              path="/admin/evaluations"
            />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default AdminPanel;