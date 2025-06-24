import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Job, addToFavorites, removeFromFavorites, isFavorite } from '../../utils/favorites';

export default function JobDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isJobFavorite, setIsJobFavorite] = useState(false);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    fetchJobDetails();
  }, [id]);

  const fetchJobDetails = async () => {
    try {
      setError(null);
      const response = await fetch(
        `https://www.coople.com/ch/resources/api/work-assignments/public-jobs/${id}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch job details');
      }
      
      const data = await response.json();
      
      if (data.status === 200 && data.data) {
        setJob(data.data);
        // Check if job is in favorites
        const favoriteStatus = await isFavorite(data.data.workAssignmentId);
        setIsJobFavorite(favoriteStatus);
      } else {
        setError('Job not found');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async () => {
    if (!job) return;
    
    try {
      if (isJobFavorite) {
        await removeFromFavorites(job.workAssignmentId);
      } else {
        await addToFavorites(job);
      }
      setIsJobFavorite(!isJobFavorite);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('de-CH', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('de-CH', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { paddingBottom: insets.bottom }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading job details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !job) {
    return (
      <SafeAreaView style={[styles.container, { paddingBottom: insets.bottom }]}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            {error || 'Job not found'}
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => router.back()}>
            <Text style={styles.retryButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { paddingBottom: insets.bottom }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.titleSection}>
            <View style={styles.titleRow}>
              <Text style={styles.jobTitle}>{job.workAssignmentName}</Text>
              <TouchableOpacity
                style={styles.favoriteButton}
                onPress={toggleFavorite}
              >
                <MaterialIcons
                  name={isJobFavorite ? 'favorite' : 'favorite-border'}
                  size={28}
                  color={isJobFavorite ? '#e91e63' : '#6c757d'}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.salaryBadge}>
              <Text style={styles.salaryText}>
                CHF {job.hourlyWage.amount.toFixed(2)}/h
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Location</Text>
            <View style={styles.locationCard}>
              <Text style={styles.locationText}>
                📍 {job.jobLocation.city}, {job.jobLocation.zip}
              </Text>
              {job.jobLocation.state && (
                <Text style={styles.stateText}>{job.jobLocation.state}</Text>
              )}
              {job.jobLocation.addressStreet && (
                <Text style={styles.addressText}>{job.jobLocation.addressStreet}</Text>
              )}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Schedule</Text>
            <View style={styles.scheduleCard}>
              <View style={styles.scheduleItem}>
                <Text style={styles.scheduleLabel}>Start Date:</Text>
                <Text style={styles.scheduleValue}>
                  {formatDate(job.periodFrom)}
                </Text>
              </View>
              <View style={styles.scheduleItem}>
                <Text style={styles.scheduleLabel}>Start Time:</Text>
                <Text style={styles.scheduleValue}>
                  {formatTime(job.periodFrom)}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Compensation</Text>
            <View style={styles.compensationCard}>
              <View style={styles.compensationItem}>
                <Text style={styles.compensationLabel}>Hourly Rate:</Text>
                <Text style={styles.compensationValue}>
                  CHF {job.hourlyWage.amount.toFixed(2)}
                </Text>
              </View>
              <View style={styles.compensationItem}>
                <Text style={styles.compensationLabel}>Total Salary:</Text>
                <Text style={styles.compensationValue}>
                  CHF {job.salary.amount.toFixed(2)}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Job Information</Text>
            <View style={styles.infoCard}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Job ID:</Text>
                <Text style={styles.infoValue}>{job.waReadableId}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Published:</Text>
                <Text style={styles.infoValue}>
                  {formatDate(job.datePublished)}
                </Text>
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.applyButton}>
            <Text style={styles.applyButtonText}>Apply for this Job</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  titleSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  jobTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 12,
    lineHeight: 32,
    flex: 1,
    flexShrink: 1,
  },
  salaryBadge: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  salaryText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1976d2',
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  locationCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  locationText: {
    fontSize: 16,
    color: '#495057',
    marginBottom: 4,
  },
  stateText: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 4,
  },
  addressText: {
    fontSize: 14,
    color: '#6c757d',
  },
  scheduleCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  scheduleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  scheduleLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#495057',
  },
  scheduleValue: {
    fontSize: 14,
    color: '#1a1a1a',
    fontWeight: '500',
  },
  compensationCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  compensationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  compensationLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#495057',
  },
  compensationValue: {
    fontSize: 16,
    color: '#1a1a1a',
    fontWeight: '600',
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#495057',
  },
  infoValue: {
    fontSize: 14,
    color: '#1a1a1a',
    fontFamily: 'monospace',
  },
  applyButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
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
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  favoriteButton: {
    padding: 4,
  },
}); 