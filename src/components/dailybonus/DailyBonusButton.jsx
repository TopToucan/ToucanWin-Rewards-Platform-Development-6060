import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Badge,
  HStack,
  Text,
  VStack,
  useDisclosure,
  useToast
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { UserController } from '../../controllers/UserController';
import DailyBonusModal from './DailyBonusModal';

const { FiStar, FiGift, FiCalendar } = FiIcons;

const MotionBox = motion(Box);
const MotionBadge = motion(Badge);

const DailyBonusButton = ({ onClaim }) => {
  const [bonusStatus, setBonusStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [claimResult, setClaimResult] = useState(null);
  const toast = useToast();

  // Check daily bonus status on component mount
  useEffect(() => {
    const status = UserController.getDailyBonusStatus();
    setBonusStatus(status);
  }, []);

  const handleClaimBonus = () => {
    setIsLoading(true);
    
    // Simulate network delay
    setTimeout(() => {
      const result = UserController.claimDailyBonus(1); // User ID 1
      
      if (result.success) {
        // Update local state
        setBonusStatus({
          ...bonusStatus,
          isAvailable: false,
          streak: result.streak
        });
        
        // Store claim result for modal
        setClaimResult(result);
        
        // Show success notification
        toast({
          title: "Daily Bonus Claimed!",
          description: `You've earned ${result.points} points. Keep the streak going!`,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        
        // Trigger confetti
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
        
        // Open modal with details
        onOpen();
        
        // Notify parent component
        if (onClaim) {
          onClaim(result.points);
        }
      } else {
        toast({
          title: "Already Claimed",
          description: "You've already claimed your daily bonus today.",
          status: "info",
          duration: 3000,
          isClosable: true,
        });
      }
      
      setIsLoading(false);
    }, 1000);
  };

  if (!bonusStatus) {
    return null;
  }

  return (
    <>
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        position="relative"
      >
        <Button
          onClick={handleClaimBonus}
          colorScheme="teal"
          size="lg"
          leftIcon={<SafeIcon icon={FiGift} />}
          isLoading={isLoading}
          loadingText="Claiming..."
          py={7}
          px={6}
          position="relative"
          _hover={{ transform: 'translateY(-3px)', boxShadow: 'lg' }}
          transition="all 0.3s"
          disabled={!bonusStatus.isAvailable}
        >
          <HStack>
            <Text>Daily Bonus</Text>
            <Text fontSize="sm" fontWeight="normal" opacity={0.8}>
              +{bonusStatus.nextBonusAmount} points
            </Text>
          </HStack>

          <AnimatePresence>
            {bonusStatus.isAvailable && (
              <MotionBadge
                position="absolute"
                top="-8px"
                right="-8px"
                colorScheme="red"
                borderRadius="full"
                fontSize="xs"
                p={2}
                className="animate-pulse"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ duration: 0.3 }}
              >
                NEW
              </MotionBadge>
            )}
          </AnimatePresence>
        </Button>

        {/* Streak indicator */}
        <HStack mt={2} justifyContent="center" fontSize="sm" color="gray.600">
          <SafeIcon icon={FiCalendar} />
          <Text>
            Current streak: <Text as="span" fontWeight="bold">{bonusStatus.streak} days</Text>
          </Text>
        </HStack>
      </MotionBox>

      {/* Bonus claim modal */}
      <DailyBonusModal
        isOpen={isOpen}
        onClose={onClose}
        result={claimResult}
      />
    </>
  );
};

export default DailyBonusButton;