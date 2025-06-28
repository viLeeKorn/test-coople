import React, { useState, useEffect } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Pressable } from '@gluestack-ui/themed';
import { useFocusEffect } from 'expo-router';
import { useThemeColors } from 'src/Config/ThemeProvider';
import { Job, isFavorite, addToFavorites, removeFromFavorites } from '#Utils/favorites';

interface FavoriteButtonProps {
  job: Job;
  size?: number;
}

export default function FavoriteButton({ 
  job, 
  size = 24
}: FavoriteButtonProps) {
  const colors = useThemeColors();
  const [isFavoriteState, setIsFavoriteState] = useState(false);

  // Load initial favorite status
  const loadFavoriteStatus = async () => {
    try {
      const status = await isFavorite(job.workAssignmentId);
      setIsFavoriteState(status);
    } catch (error) {
      console.error('Error loading favorite status:', error);
      setIsFavoriteState(false);
    }
  };

  // Load status on mount and when job changes
  useEffect(() => {
    loadFavoriteStatus();
  }, [job.workAssignmentId]);

  // Refresh status when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadFavoriteStatus();
    }, [job.workAssignmentId])
  );

  const handleToggle = async () => {
    try {
      const newState = !isFavoriteState;
      
      // Optimistic update
      setIsFavoriteState(newState);
      
      if (newState) {
        await addToFavorites(job);
      } else {
        await removeFromFavorites(job.workAssignmentId);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      // Revert on error
      setIsFavoriteState(!isFavoriteState);
    }
  };

  return (
    <Pressable
      padding="$1"
      onPress={(e: any) => {
        e.stopPropagation();
        handleToggle();
      }}
    >
      <MaterialIcons
        name={isFavoriteState ? 'favorite' : 'favorite-border'}
        size={size}
        color={isFavoriteState ? colors.accentPink : colors.secondary500}
      />
    </Pressable>
  );
} 