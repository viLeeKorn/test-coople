import React, { useState, useEffect, use } from 'react';
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
import { Job, addToFavorites, removeFromFavorites, isFavorite } from '../../../utils/favorites';

interface ApiResponse {
  status: number;
  data: {
    items: Job[];
    total: number;
  };
}

export default function JobsScreen() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pageNum, setPageNum] = useState(0);
  const [hasMoreJobs, setHasMoreJobs] = useState(true);
  const [favoriteStates, setFavoriteStates] = useState<{ [key: string]: boolean }>({});
  const router = useRouter();

  const fetchJobs = async (page: number = 0, append: boolean = false) => {
    try {
      setError(null);
      const response = await fetch(
        `https://www.coople.com/ch/resources/api/work-assignments/public-jobs/list?pageNum=${page}&pageSize=30`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch jobs');
      }
      
      const data: ApiResponse = await response.json();
      
      if (append) {
        setJobs(prevJobs => [...prevJobs, ...data.data.items]);
      } else {
        setJobs(data.data.items);
      }
      
      // Check if there are more jobs to load
      const totalJobs = data.data.total;
      const currentJobsCount = append ? jobs.length + data.data.items.length : data.data.items.length;
      setHasMoreJobs(currentJobsCount < totalJobs);
      
      // Load favorite states for new jobs
      loadFavoriteStates(data.data.items);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  };

  const loadFavoriteStates = async (jobList: Job[]) => {
    const newFavoriteStates: { [key: string]: boolean } = {};
    
    for (const job of jobList) {
      const isJobFavorite = await isFavorite(job.workAssignmentId);
      newFavoriteStates[job.workAssignmentId] = isJobFavorite;
    }
    
    setFavoriteStates(prev => ({ ...prev, ...newFavoriteStates }));
  };

  const toggleFavorite = async (job: Job) => {
    try {
      const currentState = favoriteStates[job.workAssignmentId] || false;
      
      if (currentState) {
        await removeFromFavorites(job.workAssignmentId);
      } else {
        await addToFavorites(job);
      }
      
      setFavoriteStates(prev => ({
        ...prev,
        [job.workAssignmentId]: !currentState
      }));
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadFavoriteStates(jobs);
    }, [jobs])
  );

  useEffect(() => {
    fetchJobs(0, false);
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setPageNum(0);
    fetchJobs(0, false);
  };

  const loadMoreJobs = () => {
    if (!loadingMore && hasMoreJobs) {
      setLoadingMore(true);
      const nextPage = pageNum + 1;
      setPageNum(nextPage);
      fetchJobs(nextPage, true);
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

  const renderJobCard = ({ item }: { item: Job }) => (
    <TouchableOpacity
      style={styles.card}
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
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={(e) => {
              e.stopPropagation();
              toggleFavorite(item);
            }}
          >
            <MaterialIcons
              name={favoriteStates[item.workAssignmentId] ? 'favorite' : 'favorite-border'}
              size={24}
              color={favoriteStates[item.workAssignmentId] ? '#e91e63' : '#6c757d'}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.cardContent}>
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
  );

  const renderLoadMoreButton = () => {
    if (!hasMoreJobs) {
      return (
        <View style={styles.noMoreJobsContainer}>
          <Text style={styles.noMoreJobsText}>No more jobs to load</Text>
        </View>
      );
    }

    return (
      <TouchableOpacity
        style={styles.loadMoreButton}
        onPress={loadMoreJobs}
        disabled={loadingMore}
      >
        {loadingMore ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.loadMoreButtonText}>Load More Jobs</Text>
        )}
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading jobs...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => fetchJobs(0, false)}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Available Jobs</Text>
        <Text style={styles.headerSubtitle}>
          {jobs.length} jobs loaded
        </Text>
      </View>

      <FlatList
        data={jobs}
        renderItem={renderJobCard}
        keyExtractor={(item) => item.workAssignmentId}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListFooterComponent={renderLoadMoreButton}
        onEndReached={loadMoreJobs}
        onEndReachedThreshold={0.1}
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#dc3545',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
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
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
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
  cardContent: {
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
  loadMoreButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  loadMoreButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  noMoreJobsContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  noMoreJobsText: {
    fontSize: 14,
    color: '#6c757d',
    fontStyle: 'italic',
  },
  favoriteButton: {
    padding: 4,
  },
}); 