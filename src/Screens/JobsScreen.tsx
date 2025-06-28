import React from 'react';
import {
  FlatList,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { 
  Box, 
} from '@gluestack-ui/themed';
import { Job } from '#Utils/favorites';
import { useInfiniteJobsList, usePrefetchJobDetails } from '#Hooks';
import { useThemeColors } from 'src/Config/ThemeProvider';
import { 
  JobCard, 
  LoadingSpinner, 
  ErrorView, 
  ScreenHeader, 
  LoadMoreButton 
} from '#Components/index';

export default function JobsScreen() {
  const router = useRouter();
  const colors = useThemeColors();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useInfiniteJobsList(30);

  const prefetchJobDetails = usePrefetchJobDetails();

  const allJobs = data?.pages.flatMap(page => page.data.items) ?? [];

  const onRefresh = () => {
    refetch();
  };

  const loadMoreJobs = () => {
    if (!isFetchingNextPage && hasNextPage) {
      fetchNextPage();
    }
  };

  const handleJobPress = (jobId: string) => {
    prefetchJobDetails(jobId);
    router.push(`/job/${jobId}`);
  };

  const renderJobCard = ({ item }: { item: Job }) => (
    <JobCard
      job={item}
      onPress={() => handleJobPress(item.workAssignmentId)}
    />
  );

  if (isLoading) {
    return <LoadingSpinner message="Loading jobs..." fullScreen />;
  }

  if (isError) {
    return (
      <ErrorView 
        message={error?.message || 'An error occurred'} 
        onRetry={onRefresh} 
        fullScreen 
      />
    );
  }

  return (
    <Box flex={1} backgroundColor={colors.backgroundPrimary}>
      <ScreenHeader 
        title="Available Jobs" 
        subtitle={`${allJobs.length} ${allJobs.length === 1 ? 'job' : 'jobs'} found`}
      />

      <FlatList
        data={allJobs}
        renderItem={renderJobCard}
        keyExtractor={(item) => item.workAssignmentId}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={onRefresh} />
        }
        onEndReached={loadMoreJobs}
        onEndReachedThreshold={0.1}
        ListFooterComponent={
          <LoadMoreButton
            onPress={loadMoreJobs}
            loading={isFetchingNextPage}
            hasMore={!!hasNextPage}
            text="Load More Jobs"
          />
        }
        ItemSeparatorComponent={() => <Box height="$2" />}
      />
    </Box>
  );
} 