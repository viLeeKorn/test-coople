import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Job {
  workAssignmentId: string;
  waReadableId: string;
  hourlyWage: {
    amount: number;
    currencyId: number;
  };
  salary: {
    amount: number;
    currencyId: number;
  };
  workAssignmentName: string;
  jobLocation: {
    addressStreet: string;
    extraAddress: string;
    city: string;
    zip: string;
    state?: string;
    countryId: number;
  };
  periodFrom: number;
  datePublished: number;
  branchLink?: string;
}

const FAVORITES_KEY = '@coople_favorites';

export const addToFavorites = async (job: Job): Promise<void> => {
  try {
    const existingFavorites = await getFavorites();
    const isAlreadyFavorite = existingFavorites.some(
      (favorite) => favorite.workAssignmentId === job.workAssignmentId
    );
    
    if (!isAlreadyFavorite) {
      const updatedFavorites = [...existingFavorites, job];
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
    }
  } catch (error) {
    console.error('Error adding to favorites:', error);
    throw error;
  }
};

export const removeFromFavorites = async (workAssignmentId: string): Promise<void> => {
  try {
    const existingFavorites = await getFavorites();
    const updatedFavorites = existingFavorites.filter(
      (favorite) => favorite.workAssignmentId !== workAssignmentId
    );
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
  } catch (error) {
    console.error('Error removing from favorites:', error);
    throw error;
  }
};

export const getFavorites = async (): Promise<Job[]> => {
  try {
    const favoritesJson = await AsyncStorage.getItem(FAVORITES_KEY);
    return favoritesJson ? JSON.parse(favoritesJson) : [];
  } catch (error) {
    console.error('Error getting favorites:', error);
    return [];
  }
};

export const isFavorite = async (workAssignmentId: string): Promise<boolean> => {
  try {
    const favorites = await getFavorites();
    return favorites.some((favorite) => favorite.workAssignmentId === workAssignmentId);
  } catch (error) {
    console.error('Error checking favorite status:', error);
    return false;
  }
};

export const clearFavorites = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(FAVORITES_KEY);
  } catch (error) {
    console.error('Error clearing favorites:', error);
    throw error;
  }
}; 