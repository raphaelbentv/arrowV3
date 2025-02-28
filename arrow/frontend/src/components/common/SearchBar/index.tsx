import React, { useState } from 'react';
import {
  Autocomplete,
  TextField,
  InputAdornment,
  Box,
  Typography,
  CircularProgress
} from '@mui/material';
import { Search } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Intervenant } from '../../../types/intervenant';

export interface SearchResult {
  id: string;
  type: 'intervenant' | 'formation' | 'document' | 'session';
  title: string;
  description: string;
  data?: any;
}

interface SearchBarProps {
  data?: Intervenant[];
  onSearch?: (query: string) => void;
  loading?: boolean;
  placeholder?: string;
  fullWidth?: boolean;
  variant?: 'outlined' | 'filled' | 'standard';
  size?: 'small' | 'medium';
  customStyles?: React.CSSProperties;
  onResultClick?: (result: SearchResult) => void;
}

const SearchBar = ({
  data = [],
  onSearch,
  loading = false,
  placeholder = "Rechercher...",
  fullWidth = true,
  variant = 'outlined',
  size = 'medium',
  customStyles,
  onResultClick
}: SearchBarProps) => {
  const navigate = useNavigate();
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [inputValue, setInputValue] = useState('');

  const handleSearch = (query: string) => {
    setInputValue(query);
    
    if (!query) {
      setSearchResults([]);
      if (onSearch) onSearch('');
      return;
    }

    const queryLower = query.toLowerCase();
    
    // Recherche dans les intervenants
    const results = data
      .filter(intervenant => 
        intervenant?.nom?.toLowerCase().includes(queryLower) ||
        intervenant?.prenom?.toLowerCase().includes(queryLower) ||
        intervenant.email?.toLowerCase().includes(queryLower) ||
        (intervenant.modulesEnseignes && 
         intervenant.modulesEnseignes.some(module => 
           module.toLowerCase().includes(queryLower)
         )) ||
        (intervenant.domainesExpertise && 
         intervenant.domainesExpertise.some(domaine => 
           domaine.toLowerCase().includes(queryLower)
         ))
      )
      .map(intervenant => ({
        id: intervenant._id,
        type: 'intervenant' as const,
        title: `${intervenant.prenom} ${intervenant.nom}`,
        description: intervenant.poste || 'Intervenant',
        data: intervenant
      }));

    setSearchResults(results);
    if (onSearch) onSearch(query);
  };

  const handleResultClick = (result: SearchResult | null) => {
    if (!result) return;

    if (onResultClick) {
      onResultClick(result);
    } else if (result.type === 'intervenant') {
      navigate(`/intervenants/${result.id}`);
    }
  };

  return (
    <Box sx={{ width: '100%', ...customStyles }}>
      <Autocomplete
        fullWidth={fullWidth}
        freeSolo
        loading={loading}
        options={searchResults}
        inputValue={inputValue}
        getOptionLabel={(option) => 
          typeof option === 'string' ? option : option.title
        }
        renderOption={(props, option) => {
          const { key, ...otherProps } = props;
          return (
            <li key={key} {...otherProps}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column',
                py: 1
              }}>
                <Typography variant="body1">
                  {option.title}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {option.type === 'intervenant' ? '👤 Intervenant' : ''} - {option.description}
                </Typography>
              </Box>
            </li>
          );
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder={placeholder}
            variant={variant}
            size={size}
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
              endAdornment: (
                <React.Fragment>
                  {loading ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </React.Fragment>
              ),
            }}
          />
        )}
        onChange={(_, value) => {
          if (typeof value === 'string') {
            handleSearch(value);
          } else {
            handleResultClick(value);
          }
        }}
        onInputChange={(_, newInputValue) => {
          handleSearch(newInputValue);
        }}
      />
    </Box>
  );
};

export default SearchBar; 