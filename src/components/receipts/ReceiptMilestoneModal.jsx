import React, { useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
  VStack,
  HStack,
  Box,
  Badge,
  Heading,
  useColorModeValue
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiAward, FiUpload, FiCheckCircle } = FiIcons;

const MotionBox = motion(Box);

const ReceiptMilestoneModal = ({ isOpen, onClose, milestone, pointsEarned = 0 }) => {
  const bgColor = useColorModeValue('white', 'gray.800');

  useEffect(() => {
    if (isOpen && milestone) {
      // Trigger confetti celebration
      const duration = 2000;
      const end = Date.now() + duration;
      
      // First burst
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#38B2AC', '#48BB78', '#ECC94B', '#FFFFFF']
      });
      
      // Multiple bursts
      const interval = setInterval(() => {
        if (Date.now() > end) {
          return clearInterval(interval);
        }
        
        confetti({
          particleCount: 30,
          angle: 60,
          spread: 55,
          origin: { x: 0.2, y: 0.5 },
          colors: ['#38B2AC', '#48BB78', '#FFFFFF']
        });
        
        confetti({
          particleCount: 30,
          angle: 120,
          spread: 55,
          origin: { x: 0.8, y: 0.5 },
          colors: ['#38B2AC', '#48BB78', '#FFFFFF']
        });
      }, 250);
      
      return () => clearInterval(interval);
    }
  }, [isOpen, milestone]);

  if (!milestone) return null;

  // Determine if this is a daily or total milestone
  const isDaily = milestone.id.startsWith('daily_');
  const icon = isDaily ? FiUpload : FiCheckCircle;
  const gradientColors = isDaily 
    ? 'linear(to-r, teal.500, teal.400)'
    : 'linear(to-r, green.500, green.400)';

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="md" motionPreset="slideInBottom">
      <ModalOverlay backdropFilter="blur(4px)" />
      <ModalContent borderRadius="xl" bg={bgColor} overflow="hidden">
        {/* Header */}
        <Box 
          bgGradient={gradientColors}
          py={6} 
          px={6} 
          color="white" 
          textAlign="center"
          position="relative"
          overflow="hidden"
        >
          {/* Background decorative elements */}
          <Box 
            position="absolute" 
            top="-20px" 
            left="-20px" 
            width="100px" 
            height="100px" 
            borderRadius="full" 
            bg="whiteAlpha.200" 
          />
          <Box 
            position="absolute" 
            bottom="-30px" 
            right="-30px" 
            width="120px" 
            height="120px" 
            borderRadius="full" 
            bg="whiteAlpha.200" 
          />

          <AnimatePresence>
            <MotionBox
              initial={{ opacity: 0, scale: 0.5, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              position="relative"
              zIndex={1}
            >
              <VStack spacing={3}>
                <MotionBox
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, repeatType: "loop", ease: "linear" }}
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  boxSize="60px"
                  borderRadius="full"
                  bg="whiteAlpha.300"
                >
                  <SafeIcon icon={icon} className="text-4xl" />
                </MotionBox>
                <Heading size="lg">Receipt Milestone!</Heading>
                <Text fontSize="xl" fontWeight="bold">
                  {milestone.name}
                </Text>
              </VStack>
            </MotionBox>
          </AnimatePresence>
        </Box>
        
        <ModalCloseButton color="white" />
        
        <ModalBody py={6}>
          <VStack spacing={6} align="stretch">
            {/* Description */}
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <Text textAlign="center" fontSize="lg">
                {milestone.description}
              </Text>
            </MotionBox>

            {/* Points awarded */}
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              bg="teal.50"
              p={4}
              borderRadius="md"
              textAlign="center"
            >
              <VStack spacing={2}>
                <HStack justify="center">
                  <SafeIcon icon={FiAward} className="text-teal-500" />
                  <Text fontWeight="bold" color="teal.700">
                    Points Earned
                  </Text>
                </HStack>
                <Badge colorScheme="teal" fontSize="2xl" py={2} px={4} borderRadius="full">
                  +{pointsEarned || milestone.points}
                </Badge>
              </VStack>
            </MotionBox>

            {/* Achievement Type */}
            <Box 
              bg={isDaily ? "teal.50" : "green.50"} 
              p={4} 
              borderRadius="md"
            >
              <VStack>
                <Badge 
                  colorScheme={isDaily ? "teal" : "green"}
                  fontSize="md"
                  px={3}
                  py={1}
                >
                  {isDaily ? "Daily Achievement" : "Total Achievement"}
                </Badge>
                <Text fontSize="sm" color={isDaily ? "teal.600" : "green.600"} textAlign="center">
                  {isDaily 
                    ? "Keep uploading receipts today to unlock more rewards!" 
                    : "You've reached a significant milestone in your total uploads!"}
                </Text>
              </VStack>
            </Box>

            {/* Encouragement message */}
            <MotionBox
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.6 }}
            >
              <Text fontSize="sm" color="gray.600" textAlign="center">
                Continue uploading receipts to earn more points and unlock exclusive rewards!
              </Text>
            </MotionBox>
          </VStack>
        </ModalBody>
        
        <ModalFooter>
          <Button colorScheme="teal" onClick={onClose} size="lg" width="full">
            Continue
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ReceiptMilestoneModal;