import React from 'react';
import { 
  Box, 
  Text, 
  Pressable, 
  VStack, 
  HStack 
} from '@gluestack-ui/themed';
import { Job } from '#Utils/favorites';
import { useThemeColors } from 'src/Config/ThemeProvider';
import WageBadge from './WageBadge';
import LocationInfo from './LocationInfo';
import FavoriteButton from './FavoriteButton';
import DateFormatter from './DateFormatter';

interface JobCardProps {
  job: Job;
  onPress: () => void;
}

export default function JobCard({ job, onPress }: JobCardProps) {
  const colors = useThemeColors();

  return (
    <Pressable 
      backgroundColor={colors.backgroundCard}
      borderRadius="lg"
      padding="$4"
      marginBottom="$3"
      shadowColor="#000"
      shadowOffset={{
        width: 0,
        height: 2,
      }}
      shadowOpacity={0.1}
      shadowRadius={3.84}
      elevation={5}
      onPress={onPress}
      $pressed={{ opacity: 0.7 }}
    >
      <VStack space="md">
        <HStack justifyContent="space-between" alignItems="flex-start">
          <Text 
            fontSize="$lg" 
            fontWeight="$semibold" 
            color={colors.textPrimary} 
            flex={1} 
            marginRight="$3"
            numberOfLines={2}
          >
            {job.workAssignmentName}
          </Text>
          <VStack alignItems="flex-end" space="sm">
            <WageBadge amount={job.hourlyWage.amount} />
            <FavoriteButton 
              job={job}
            />
          </VStack>
        </HStack>

        <VStack space="sm">
          <LocationInfo location={job.jobLocation} />

          <HStack alignItems="center" space="sm">
            <Text fontSize="$sm" fontWeight="$medium" color={colors.textSecondary}>
              Start:
            </Text>
            <DateFormatter 
              timestamp={job.periodFrom} 
              format="datetime" 
              color={colors.textMuted}
            />
          </HStack>

          <DateFormatter 
            timestamp={job.datePublished} 
            format="date" 
            size="xs"
            color={colors.textLight}
            prefix="Published:"
          />
        </VStack>

        <Box borderTopWidth={1} borderTopColor={colors.borderLight} paddingTop="$2">
          <Text fontSize="$xs" color={colors.textLight}>
            ID: {job.waReadableId}
          </Text>
        </Box>
      </VStack>
    </Pressable>
  );
} 