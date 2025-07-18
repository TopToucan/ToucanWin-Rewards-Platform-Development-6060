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

const { FiStar, FiGift, FiCalendar, FiTrendingUp } = FiIcons;

const MotionBox = motion(Box);

const DailyBonusModal = ({ isOpen, onClose, result }) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  
  useEffect(() => {
    if (isOpen && result) {
      // If this is a streak milestone (every 5 days), add extra confetti
      if (result.streakMilestone) {
        // Extra celebration for streak milestones
        const duration = 3000;
        const end = Date.now() + duration;
        
        // Initial bigger burst
        confetti({
          particleCount: 150,
          spread: 100,
          origin: { y: 0.6 },
          colors: ['#38B2AC', '#ECC94B', '#FFFFFF']
        });
        
        // Multiple bursts for milestones
        const interval = setInterval(() => {
          if (Date.now() > end) {
            return clearInterval(interval);
          }
          
          // Left side burst
          confetti({
            particleCount: 50,
            angle: 60,
            spread: 55,
            origin: { x: 0.2, y: 0.5 },
            colors: ['#38B2AC', '#ECC94B', '#FFFFFF']
          });
          
          // Right side burst
          confetti({
            particleCount: 50,
            angle: 120,
            spread: 55,
            origin: { x: 0.8, y: 0.5 },
            colors: ['#38B2AC', '#ECC94B', '#FFFFFF']
          });
        }, 300);
        
        return () => clearInterval(interval);
      }
    }
  }, [isOpen, result]);
  
  if (!result) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
      <ModalOverlay backdropFilter="blur(4px)" />
      <ModalContent borderRadius="xl" bg={bgColor} overflow="hidden">
        {/* Header */}
        <Box 
          bg="teal.500" 
          py={6} 
          px={6} 
          color="white" 
          textAlign="center"
          position="relative"
          overflow="hidden"
        >
          {/* Decorative circles */}
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
              initial={{ scale: 0.5, rotate: 0 }}
              animate={{ 
                scale: 1, 
                rotate: [0, 10, -10, 10, 0],
                transition: { duration: 0.5 }
              }}
              display="flex"
              justifyContent="center"
              alignItems="center"
              boxSize="60px"
              borderRadius="full"
              bg="whiteAlpha.300"
            >
              <SafeIcon icon={FiGift} className="text-4xl" />
            </MotionBox>
            <Heading size="lg">Daily Bonus Claimed!</Heading>
            <Text fontSize="lg">You've received your daily reward</Text>
          </VStack>
        </Box>
        
        <ModalCloseButton color="white" />
        
        <ModalBody py={6}>
          <VStack spacing={6} align="stretch">
            {/* Points awarded */}
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              bg="teal.50"
              p={6}
              borderRadius="lg"
              textAlign="center"
            >
              <VStack spacing={2}>
                <Text fontWeight="medium" color="teal.700">Points Earned</Text>
                <MotionBox
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1.1 }}
                  transition={{ 
                    duration: 0.5,
                    repeat: 1,
                    repeatType: "reverse"
                  }}
                >
                  <Badge colorScheme="teal" fontSize="3xl" py={3} px={6} borderRadius="full">
                    +{result.points}
                  </Badge>
                </MotionBox>
              </VStack>
            </MotionBox>
            
            {/* Streak information */}
            <Box p={4} bg={useColorModeValue('gray.50', 'gray.700')} borderRadius="md">
              <VStack spacing={3}>
                <HStack>
                  <SafeIcon icon={FiCalendar} className="text-teal-500" />
                  <Text fontWeight="medium">Current Streak</Text>
                </HStack>
                
                <HStack spacing={1}>
                  {/* Render streak days as stars */}
                  {Array.from({ length: Math.min(result.streak, 10) }).map((_, i) => (
                    <MotionBox
                      key={i}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ 
                        scale: 1, 
                        opacity: 1 
                      }}
                      transition={{ 
                        duration: 0.3, 
                        delay: 0.3 + (i * 0.1) 
                      }}
                    >
                      <SafeIcon 
                        icon={FiStar} 
                        className={`text-${i < 5 ? 'yellow' : 'teal'}-${400 + (i % 5) * 100} ${result.streak >= 5 && i === 4 ? 'fill-current' : ''} ${result.streak >= 10 && i === 9 ? 'fill-current' : ''}`}
                      />
                    </MotionBox>
                  ))}
                </HStack>
                
                <Text fontSize="lg" fontWeight="bold" color="teal.600">
                  {result.streak} {result.streak === 1 ? 'Day' : 'Days'}
                </Text>
                
                {result.streakMilestone && (
                  <MotionBox
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                  >
                    <Badge colorScheme="purple" p={2} fontSize="md">
                      {result.streak}-Day Streak Milestone!
                    </Badge>
                  </MotionBox>
                )}
              </VStack>
            </Box>
            
            {/* Next bonus info */}
            <HStack justify="space-between" fontSize="sm" color="gray.600">
              <Text>Next daily bonus:</Text>
              <HStack>
                <SafeIcon icon={FiTrendingUp} />
                <Text fontWeight="bold">Tomorrow</Text>
              </HStack>
            </HStack>
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

export default DailyBonusModal;