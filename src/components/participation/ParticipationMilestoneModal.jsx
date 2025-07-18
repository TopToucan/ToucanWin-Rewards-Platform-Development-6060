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
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiAward, FiTrophy, FiStar } = FiIcons;

const MotionBox = motion(Box);

const ParticipationMilestoneModal = ({ isOpen, onClose, milestone }) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  
  useEffect(() => {
    if (isOpen && milestone) {
      // Trigger celebration confetti
      const duration = 3000;
      const end = Date.now() + duration;
      
      // Initial burst
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#38B2AC', '#48BB78', '#ECC94B', '#FFFFFF']
      });
      
      // Continuous bursts
      const interval = setInterval(() => {
        if (Date.now() > end) {
          return clearInterval(interval);
        }
        
        confetti({
          particleCount: 30,
          angle: 60,
          spread: 55,
          origin: { x: 0.2, y: 0.5 },
          colors: ['#38B2AC', '#48BB78', '#ECC94B']
        });
        
        confetti({
          particleCount: 30,
          angle: 120,
          spread: 55,
          origin: { x: 0.8, y: 0.5 },
          colors: ['#38B2AC', '#48BB78', '#ECC94B']
        });
      }, 250);
      
      return () => clearInterval(interval);
    }
  }, [isOpen, milestone]);
  
  if (!milestone) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="md" motionPreset="slideInBottom">
      <ModalOverlay backdropFilter="blur(4px)" />
      <ModalContent borderRadius="xl" bg={bgColor} overflow="hidden">
        {/* Header */}
        <Box 
          bg="linear-gradient(135deg, #38B2AC 0%, #48BB78 100%)"
          py={6} 
          px={6} 
          color="white" 
          textAlign="center"
          position="relative"
          overflow="hidden"
        >
          {/* Decorative elements */}
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

          <VStack spacing={3} position="relative" zIndex={1}>
            <MotionBox
              initial={{ scale: 0.5, rotate: -180 }}
              animate={{ 
                scale: 1, 
                rotate: 0,
                transition: { 
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                  duration: 0.6
                }
              }}
              display="flex"
              justifyContent="center"
              alignItems="center"
              boxSize="70px"
              borderRadius="full"
              bg="whiteAlpha.300"
            >
              <SafeIcon icon={FiTrophy} className="text-4xl" />
            </MotionBox>
            
            <Heading size="lg">Milestone Achieved!</Heading>
            <Text fontSize="xl" fontWeight="bold">
              {milestone.title}
            </Text>
          </VStack>
        </Box>
        
        <ModalCloseButton color="white" />
        
        <ModalBody py={6}>
          <VStack spacing={6} align="stretch">
            {/* Milestone Description */}
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              textAlign="center"
            >
              <Text fontSize="lg" color="gray.700" mb={2}>
                {milestone.description}
              </Text>
              <Text fontSize="md" color="gray.600">
                You've maintained your participation streak for {milestone.days} consecutive days!
              </Text>
            </MotionBox>
            
            {/* Points Awarded */}
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              bg="green.50"
              p={6}
              borderRadius="lg"
              textAlign="center"
            >
              <VStack spacing={3}>
                <HStack justify="center">
                  <SafeIcon icon={FiAward} className="text-green-500" />
                  <Text fontWeight="bold" color="green.700">
                    Milestone Reward
                  </Text>
                </HStack>
                
                <MotionBox
                  initial={{ scale: 0.8 }}
                  animate={{ scale: [0.8, 1.2, 1] }}
                  transition={{ 
                    duration: 0.6,
                    times: [0, 0.6, 1],
                    delay: 0.6
                  }}
                >
                  <Badge colorScheme="green" fontSize="3xl" py={3} px={6} borderRadius="full">
                    +{milestone.points} pts
                  </Badge>
                </MotionBox>
              </VStack>
            </MotionBox>
            
            {/* Streak Stats */}
            <Box p={4} bg={useColorModeValue('gray.50', 'gray.700')} borderRadius="md">
              <VStack spacing={3}>
                <HStack spacing={6} justify="center">
                  <VStack spacing={1}>
                    <Text fontSize="2xl" fontWeight="bold" color="teal.600">
                      {milestone.days}
                    </Text>
                    <Text fontSize="sm" color="gray.600">Days Streak</Text>
                  </VStack>
                  
                  <VStack spacing={1}>
                    <HStack>
                      {Array.from({ length: Math.min(milestone.days, 5) }).map((_, i) => (
                        <MotionBox
                          key={i}
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ 
                            duration: 0.3, 
                            delay: 0.8 + (i * 0.1) 
                          }}
                        >
                          <SafeIcon 
                            icon={FiStar} 
                            className="text-yellow-400 fill-current"
                          />
                        </MotionBox>
                      ))}
                      {milestone.days > 5 && (
                        <Text fontSize="sm" color="gray.600" ml={1}>
                          +{milestone.days - 5}
                        </Text>
                      )}
                    </HStack>
                    <Text fontSize="sm" color="gray.600">Achievement</Text>
                  </VStack>
                </HStack>
              </VStack>
            </Box>
            
            {/* Encouragement */}
            <MotionBox
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 1 }}
              textAlign="center"
            >
              <Text fontSize="sm" color="gray.600">
                Keep up the amazing work! Your consistency is paying off. 
                Continue participating daily to unlock even greater rewards!
              </Text>
            </MotionBox>
          </VStack>
        </ModalBody>
        
        <ModalFooter>
          <Button colorScheme="teal" onClick={onClose} size="lg" width="full">
            Continue Your Streak
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ParticipationMilestoneModal;