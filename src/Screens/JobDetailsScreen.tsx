import React from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  Box, 
  Text, 
  ScrollView,  
  VStack, 
  HStack, 
} from '@gluestack-ui/themed';
import { useJobDetails } from '#Hooks';
import { useThemeColors } from 'src/Config/ThemeProvider';
import { 
  LoadingSpinner, 
  ErrorView, 
  WageBadge, 
  FavoriteButton, 
  LocationInfo, 
  DateFormatter 
} from '#Components/index';

export default function JobDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();

  const {
    data: jobDetails,
    isLoading,
    isError,
    error,
  } = useJobDetails(id);

  const job = jobDetails?.data;

  const handleGoBack = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <Box 
        flex={1} 
        backgroundColor={colors.backgroundPrimary} 
        paddingBottom={insets.bottom}
      >
        <LoadingSpinner message="Loading job details..." fullScreen />
      </Box>
    );
  }

  if (isError || !job) {
    return (
      <Box 
        flex={1} 
        backgroundColor={colors.backgroundPrimary} 
        paddingBottom={insets.bottom}
      >
        <ErrorView 
          message={error?.message || 'Job not found'} 
          onRetry={handleGoBack} 
          retryText="Go Back"
          fullScreen 
        />
      </Box>
    );
  }

  return (
    <Box 
      flex={1} 
      backgroundColor={colors.backgroundPrimary} 
      paddingBottom={insets.bottom}
    >
      <ScrollView 
        flex={1} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ backgroundColor: colors.backgroundPrimary }}
      >
        <VStack padding="$4" space="lg">
          <Box 
            backgroundColor={colors.backgroundCard}
            borderRadius="lg"
            padding="$5"
            shadowColor="#000"
            shadowOffset={{
              width: 0,
              height: 2,
            }}
            shadowOpacity={0.1}
            shadowRadius={3.84}
            elevation={5}
          >
            <HStack alignItems="center" justifyContent="space-between" marginBottom="$3">
              <Text 
                fontSize="$2xl" 
                fontWeight="$bold" 
                color={colors.textPrimary} 
                flex={1} 
                flexShrink={1}
                lineHeight="$3xl"
              >
                {job.workAssignmentName}
              </Text>
              <FavoriteButton 
                job={job}
                size={28}
              />
            </HStack>
            <WageBadge amount={job.hourlyWage.amount} size="md" />
          </Box>

          <VStack space="lg">
            <Text fontSize="$lg" fontWeight="$semibold" color={colors.textPrimary}>
              Location
            </Text>
            <Box 
              backgroundColor={colors.backgroundCard}
              borderRadius="lg"
              padding="$4"
            >
              <LocationInfo location={job.jobLocation} size="lg" />
            </Box>

            <Text fontSize="$lg" fontWeight="$semibold" color={colors.textPrimary}>
              Schedule
            </Text>
            <Box 
              backgroundColor={colors.backgroundCard}
              borderRadius="lg"
              padding="$4"
            >
              <VStack space="md">
                <HStack justifyContent="space-between" alignItems="center">
                  <Text fontSize="$md" color={colors.textSecondary}>
                    Start Date:
                  </Text>
                  <DateFormatter 
                    timestamp={job.periodFrom} 
                    format="full" 
                    color={colors.textPrimary}
                  />
                </HStack>
                <HStack justifyContent="space-between" alignItems="center">
                  <Text fontSize="$md" color={colors.textSecondary}>
                    Start Time:
                  </Text>
                  <DateFormatter 
                    timestamp={job.periodFrom} 
                    format="time" 
                    color={colors.textPrimary}
                  />
                </HStack>
              </VStack>
            </Box>

            <Text fontSize="$lg" fontWeight="$semibold" color={colors.textPrimary}>
              Additional Information
            </Text>
            <Box 
              backgroundColor={colors.backgroundCard}
              borderRadius="lg"
              padding="$4"
            >
              <VStack space="md">
                <HStack justifyContent="space-between" alignItems="center">
                  <Text fontSize="$md" color={colors.textSecondary}>
                    Published:
                  </Text>
                  <DateFormatter 
                    timestamp={job.datePublished} 
                    format="date" 
                    color={colors.textPrimary}
                  />
                </HStack>
                <HStack justifyContent="space-between" alignItems="center">
                  <Text fontSize="$md" color={colors.textSecondary}>
                    Job ID:
                  </Text>
                  <Text fontSize="$md" color={colors.textPrimary} fontWeight="$medium">
                    {job.waReadableId}
                  </Text>
                </HStack>
              </VStack>
            </Box>
          </VStack>
        </VStack>
      </ScrollView>
    </Box>
  );
} 