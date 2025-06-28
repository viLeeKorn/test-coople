import React, { useState, useEffect } from 'react';
import {
  FlatList,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { 
  Box, 
  Text, 
  VStack, 
  HStack, 
  Pressable, 
  Divider,
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter
} from '@gluestack-ui/themed';
import { Job, getFavorites, removeFromFavorites } from '#Utils/favorites';
import { useThemeColors } from 'src/Config/ThemeProvider';
import { 
  LoadingSpinner, 
  EmptyStateView, 
  ScreenHeader, 
  WageBadge, 
  LocationInfo, 
  DateFormatter 
} from '#Components/index';

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<string | null>(null);
  const router = useRouter();
  const colors = useThemeColors();

  const loadFavorites = async () => {
    try {
      setLoading(true);
      const favs = await getFavorites();
      setFavorites(favs);
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadFavorites();
    }, [])
  );

  const showDeleteConfirmation = (jobId: string) => {
    setJobToDelete(jobId);
    setShowDeleteModal(true);
  };

  const hideDeleteModal = () => {
    setShowDeleteModal(false);
    setJobToDelete(null);
  };

  const confirmDelete = async () => {
    if (!jobToDelete) return;
    
    try {
      await removeFromFavorites(jobToDelete);
      setFavorites(prev => prev.filter(job => job.workAssignmentId !== jobToDelete));
    } catch (error) {
      console.error('Error removing favorite:', error);
    } finally {
      hideDeleteModal();
    }
  };

  const renderFavoriteCard = ({ item }: { item: Job }) => (
    <Box
      backgroundColor={colors.backgroundCard}
      borderRadius="$lg"
      marginBottom="$3"
      shadowColor={colors.shadowPrimary}
      shadowOffset={{ width: 0, height: 2 }}
      shadowOpacity={0.1}
      shadowRadius={3.84}
      elevation={5}
    >
      <Pressable
        onPress={() => router.push(`/job/${item.workAssignmentId}`)}
        padding="$4"
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
              {item.workAssignmentName}
            </Text>
            <VStack alignItems="flex-end" space="sm">
              <WageBadge amount={item.hourlyWage.amount} />
              <MaterialIcons name="favorite" size={24} color={colors.accentPink} />
            </VStack>
          </HStack>

          <VStack space="sm">
            <LocationInfo location={item.jobLocation} />

            <HStack alignItems="center" space="sm">
              <Text fontSize="$sm" fontWeight="$medium" color={colors.textSecondary}>
                Start:
              </Text>
              <DateFormatter 
                timestamp={item.periodFrom} 
                format="datetime" 
                color={colors.textMuted}
              />
            </HStack>

            <DateFormatter 
              timestamp={item.datePublished} 
              format="date" 
              size="xs"
              color={colors.textLight}
              prefix="Published:"
            />
          </VStack>

          <Divider />
          <Text fontSize="$xs" color={colors.textLight}>
            ID: {item.waReadableId}
          </Text>
        </VStack>
      </Pressable>

      <Pressable
        onPress={() => showDeleteConfirmation(item.workAssignmentId)}
        backgroundColor={colors.gluestackRed50}
        paddingVertical="$3"
        borderBottomLeftRadius="$lg"
        borderBottomRightRadius="$lg"
        borderTopWidth={1}
        borderTopColor={colors.borderLight}
      >
        <HStack justifyContent="center" alignItems="center" space="sm">
          <MaterialIcons name="delete" size={20} color={colors.accentRed} />
          <Text fontSize="$sm" color={colors.gluestackRed600} fontWeight="$semibold">
            Remove
          </Text>
        </HStack>
      </Pressable>
    </Box>
  );

  if (loading) {
    return <LoadingSpinner message="Loading favorites..." fullScreen />;
  }

  if (!loading && favorites.length === 0) {
    return (
      <EmptyStateView
        title="No Favorites Yet"
        message="Jobs you favorite will appear here"
        icon="favorite-border"
        fullScreen
      />
    );
  }

  return (
    <Box flex={1} backgroundColor={colors.backgroundPrimary}>
      <ScreenHeader 
        title="Favorites" 
        subtitle={`${favorites.length} ${favorites.length === 1 ? 'favorite' : 'favorites'}`}
      />

      <FlatList
        data={favorites}
        renderItem={renderFavoriteCard}
        keyExtractor={(item) => item.workAssignmentId}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <Box height="$2" />}
      />

      <Modal isOpen={showDeleteModal} onClose={hideDeleteModal}>
        <ModalBackdrop />
        <ModalContent backgroundColor={colors.backgroundCard}>
          <ModalHeader>
            <Text fontSize="$lg" fontWeight="$semibold" color={colors.textPrimary}>
              Remove from Favorites
            </Text>
          </ModalHeader>
          <ModalBody>
            <Text fontSize="$md" color={colors.textSecondary}>
              Are you sure you want to remove this job from your favorites?
            </Text>
          </ModalBody>
          <ModalFooter>
            <HStack space="sm" flex={1}>
              <Pressable
                flex={1}
                padding="$3"
                borderRadius="md"
                borderWidth={1}
                borderColor={colors.borderLight}
                onPress={hideDeleteModal}
              >
                <Text fontSize="$md" color={colors.textSecondary} textAlign="center">
                  Cancel
                </Text>
              </Pressable>
              <Pressable
                flex={1}
                padding="$3"
                borderRadius="md"
                backgroundColor={colors.accentRed}
                onPress={confirmDelete}
              >
                <Text fontSize="$md" color={colors.textWhite} textAlign="center" fontWeight="$semibold">
                  Remove
                </Text>
              </Pressable>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
} 