import React, { useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Box,
  VStack,
  Heading,
  Text,
  Badge,
  Button,
  useColorModeValue
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiAward } = FiIcons;
const MotionBox = motion(Box);

const BadgeAwardModal = ({ isOpen, onClose, badge, pointsEarned = 0 }) => {
  useEffect(() => {
    if (isOpen && badge) {
      // Trigger confetti celebration
      const duration = 2000;
      const end = Date.now() + duration;
      
      // First burst confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#38B2AC', '#ECC94B', '#FFFFFF']
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
          colors: ['#38B2AC', '#ECC94B', '#FFFFFF']
        });
        
        confetti({
          particleCount: 30,
          angle: 120,
          spread: 55,
          origin: { x: 0.8, y: 0.5 },
          colors: ['#38B2AC', '#ECC94B', '#FFFFFF']
        });
      }, 250);
      
      return () => clearInterval(interval);
    }
  }, [isOpen, badge]);
  
  if (!badge) return null;
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="md" motionPreset="slideInBottom">
      <ModalOverlay backdropFilter="blur(4px)" />
      <ModalContent borderRadius="xl" bg={useColorModeValue('white', 'gray.800')} overflow="hidden">
        {/* Header */}
        <Box 
          bg={badge.category === 'special' ? 'yellow.500' : 'teal.500'} 
          py={6} 
          px={6} 
          color="white" 
          textAlign="center"
          position="relative"
          overflow="hidden"
        >
          {/* Background decorations */}
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
                  <SafeIcon icon={FiAward} className="text-4xl fill-current" />
                </MotionBox>
                <Heading size="lg">New Badge Earned!</Heading>
                <Text fontSize="xl" fontWeight="bold">
                  {badge.name}
                </Text>
              </VStack>
            </MotionBox>
          </AnimatePresence>
        </Box>
        
        <ModalCloseButton color="white" />
        
        <ModalBody py={6}>
          <VStack spacing={6} align="stretch">
            {/* Badge Image */}
            <MotionBox 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              display="flex"
              justifyContent="center"
            >
              <Box 
                className="w-32 h-32 rounded-full overflow-hidden mycred-rank-image"
                border="4px solid"
                borderColor={badge.category === 'special' ? 'yellow.500' : 'teal.500'}
                mx="auto"
              >
                <img 
                  src={badge.image} 
                  alt={badge.name} 
                  className="w-full h-full object-cover"
                />
              </Box>
            </MotionBox>
            
            {/* Description */}
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <Text textAlign="center" fontSize="lg">
                {badge.description}
              </Text>
            </MotionBox>
            
            {/* Points awarded */}
            {pointsEarned > 0 && (
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
                    +{pointsEarned}
                  </Badge>
                </VStack>
              </MotionBox>
            )}
            
            {/* Encouragement message */}
            <MotionBox
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.6 }}
            >
              <Text fontSize="sm" color="gray.600" textAlign="center">
                Keep collecting badges to showcase your achievements and earn more rewards!
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

export default BadgeAwardModal;