import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Job, removeFromFavorites, getFavorites } from '../../../utils/favorites';

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const loadFavorites = async () => {
    try {
      setLoading(true)
      const favoriteJobs = await getFavorites();
      setFavorites(favoriteJobs);
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadFavorites();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadFavorites();
  };

  const removeFavorite = async (workAssignmentId: string) => {
    try {
      await removeFromFavorites(workAssignmentId);
      setFavorites(prev => prev.filter(job => job.workAssignmentId !== workAssignmentId));
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('de-CH', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('de-CH', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderFavoriteCard = ({ item }: { item: Job }) => (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.cardContent}
        onPress={() => router.push(`/job/${item.workAssignmentId}`)}
        activeOpacity={0.7}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.jobTitle} numberOfLines={2}>
            {item.workAssignmentName}
          </Text>
          <View style={styles.headerRight}>
            <View style={styles.salaryContainer}>
              <Text style={styles.salaryText}>
                CHF {item.hourlyWage.amount.toFixed(2)}/h
              </Text>
            </View>
            <MaterialIcons name="favorite" size={24} color="#e91e63" />
          </View>
        </View>

        <View style={styles.jobInfo}>
          <View style={styles.locationContainer}>
            <Text style={styles.locationText}>
              📍 {item.jobLocation.city}, {item.jobLocation.zip}
            </Text>
            {item.jobLocation.state && (
              <Text style={styles.stateText}>{item.jobLocation.state}</Text>
            )}
          </View>

          <View style={styles.dateContainer}>
            <Text style={styles.dateLabel}>Start:</Text>
            <Text style={styles.dateText}>
              {formatDate(item.periodFrom)} at {formatTime(item.periodFrom)}
            </Text>
          </View>

          <View style={styles.publishedContainer}>
            <Text style={styles.publishedText}>
              Published: {formatDate(item.datePublished)}
            </Text>
          </View>
        </View>

        <View style={styles.cardFooter}>
          <Text style={styles.jobId}>ID: {item.waReadableId}</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => removeFavorite(item.workAssignmentId)}
      >
        <MaterialIcons name="delete" size={20} color="#dc3545" />
        <Text style={styles.deleteButtonText}>Remove</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading favorites...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!loading && favorites.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <MaterialIcons name="favorite-border" size={64} color="#6c757d" />
          <Text style={styles.emptyTitle}>No Favorite Jobs</Text>
          <Text style={styles.emptySubtitle}>
            Start browsing jobs and add them to your favorites!
          </Text>
          <TouchableOpacity
            style={styles.browseButton}
            onPress={onRefresh}
          >
            <Text style={styles.browseButtonText}>Browse Jobs</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Favorite Jobs</Text>
        <Text style={styles.headerSubtitle}>
          {favorites.length} {favorites.length === 1 ? 'job' : 'jobs'} saved
        </Text>
      </View>

      <FlatList
        data={favorites}
        renderItem={renderFavoriteCard}
        keyExtractor={(item) => item.workAssignmentId}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 20,
    paddingTop: 32,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6c757d',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6c757d',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
    marginBottom: 24,
  },
  browseButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  browseButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  listContainer: {
    padding: 16,
  },
  separator: {
    height: 12,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    flex: 1,
    marginRight: 12,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  salaryContainer: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  salaryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1976d2',
  },
  jobInfo: {
    marginBottom: 12,
  },
  locationContainer: {
    marginBottom: 8,
  },
  locationText: {
    fontSize: 16,
    color: '#495057',
    marginBottom: 2,
  },
  stateText: {
    fontSize: 14,
    color: '#6c757d',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  dateLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#495057',
    marginRight: 8,
  },
  dateText: {
    fontSize: 14,
    color: '#6c757d',
  },
  publishedContainer: {
    marginBottom: 8,
  },
  publishedText: {
    fontSize: 12,
    color: '#adb5bd',
  },
  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: '#f1f3f4',
    paddingTop: 8,
  },
  jobId: {
    fontSize: 12,
    color: '#adb5bd',
    fontFamily: 'monospace',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff5f5',
    paddingVertical: 12,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f3f4',
  },
  deleteButtonText: {
    color: '#dc3545',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
}); 