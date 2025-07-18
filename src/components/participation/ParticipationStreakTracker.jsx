import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Progress,
  Badge,
  Heading,
  SimpleGrid,
  useColorModeValue,
  Flex,
  Tooltip,
  useDisclosure
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { UserController } from '../../controllers/UserController';
import ParticipationMilestoneModal from './ParticipationMilestoneModal';

const { FiCalendar, FiAward, FiTrendingUp, FiTarget, FiStar } = FiIcons;

const MotionBox = motion(Box);

const MilestoneCard = ({ milestone, isAchieved, isCurrent, progress }) => {
  const cardBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  
  return (
    <MotionBox
      whileHover={{ y: -3, scale: 1.02 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      bg={cardBg}
      p={4}
      borderRadius="lg"
      shadow="md"
      border="2px solid"
      borderColor={isAchieved ? "green.400" : isCurrent ? "teal.400" : borderColor}
      opacity={isAchieved ? 1 : isCurrent ? 0.9 : 0.6}
      position="relative"
      overflow="hidden"
    >
      {/* Achievement glow effect */}
      {isAchieved && (
        <Box
          position="absolute"
          top="-50%"
          left="-50%"
          right="-50%"
          bottom="-50%"
          bg="linear-gradient(45deg, transparent, rgba(72, 187, 120, 0.1), transparent)"
          transform="rotate(45deg)"
          animation="shimmer 2s infinite"
        />
      )}
      
      <VStack spacing={3} align="center" position="relative" zIndex={1}>
        <Flex
          w="50px"
          h="50px"
          borderRadius="full"
          bg={isAchieved ? "green.100" : isCurrent ? "teal.100" : "gray.100"}
          color={isAchieved ? "green.500" : isCurrent ? "teal.500" : "gray.400"}
          justify="center"
          align="center"
        >
          <SafeIcon 
            icon={isAchieved ? FiAward : FiTarget} 
            className={`text-xl ${isAchieved ? 'fill-current' : ''}`}
          />
        </Flex>
        
        <VStack spacing={1} textAlign="center">
          <Text fontWeight="bold" fontSize="sm" color={isAchieved ? "green.700" : "gray.700"}>
            {milestone.title}
          </Text>
          <Text fontSize="xs" color="gray.500" noOfLines={2}>
            {milestone.description}
          </Text>
          <Badge 
            colorScheme={isAchieved ? "green" : isCurrent ? "teal" : "gray"}
            fontSize="xs"
          >
            {milestone.days} days • {milestone.points} pts
          </Badge>
        </VStack>
        
        {isCurrent && !isAchieved && (
          <Box w="full">
            <Progress 
              value={progress} 
              size="sm" 
              colorScheme="teal" 
              borderRadius="full"
              bg="gray.200"
            />
            <Text fontSize="xs" color="gray.500" textAlign="center" mt={1}>
              {Math.round(progress)}% complete
            </Text>
          </Box>
        )}
      </VStack>
    </MotionBox>
  );
};

const StreakCalendar = ({ streakHistory, currentStreak }) => {
  const cardBg = useColorModeValue('white', 'gray.700');
  
  // Generate last 14 days for display
  const generateCalendarDays = () => {
    const days = [];
    const today = new Date();
    
    for (let i = 13; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const historyRecord = streakHistory.find(record => record.date === dateStr);
      const isActive = !!historyRecord;
      const isToday = i === 0;
      
      days.push({
        date: dateStr,
        day: date.getDate(),
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
        isActive,
        isToday,
        activities: historyRecord?.activities || []
      });
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays();

  return (
    <Box bg={cardBg} p={4} borderRadius="lg" shadow="md">
      <VStack spacing={4}>
        <Heading size="sm" color="gray.700">
          Last 14 Days Activity
        </Heading>
        
        <SimpleGrid columns={7} spacing={2} w="full">
          {calendarDays.map((day, index) => (
            <Tooltip
              key={day.date}
              label={`${day.dayName} ${day.day}: ${day.isActive ? `${day.activities.length} activities` : 'No activity'}`}
              placement="top"
            >
              <MotionBox
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                w="32px"
                h="32px"
                borderRadius="md"
                bg={day.isActive ? "teal.500" : "gray.200"}
                color={day.isActive ? "white" : "gray.500"}
                display="flex"
                alignItems="center"
                justifyContent="center"
                fontSize="xs"
                fontWeight="bold"
                border={day.isToday ? "2px solid" : "none"}
                borderColor={day.isToday ? "blue.400" : "transparent"}
                cursor="pointer"
                _hover={{
                  transform: 'scale(1.1)',
                  boxShadow: 'md'
                }}
              >
                {day.day}
              </MotionBox>
            </Tooltip>
          ))}
        </SimpleGrid>
        
        <HStack spacing={4} fontSize="xs" color="gray.500">
          <HStack>
            <Box w="12px" h="12px" bg="teal.500" borderRadius="sm" />
            <Text>Active Day</Text>
          </HStack>
          <HStack>
            <Box w="12px" h="12px" bg="gray.200" borderRadius="sm" />
            <Text>Inactive Day</Text>
          </HStack>
        </HStack>
      </VStack>
    </Box>
  );
};

const ParticipationStreakTracker = () => {
  const [streakData, setStreakData] = useState(null);
  const [milestones, setMilestones] = useState([]);
  const [newMilestone, setNewMilestone] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cardBg = useColorModeValue('white', 'gray.700');

  useEffect(() => {
    const data = UserController.getParticipationStreakData();
    const milestoneData = UserController.getParticipationMilestones();
    
    setStreakData(data);
    setMilestones(milestoneData);
  }, []);

  useEffect(() => {
    // Check for milestone celebrations (this would be triggered by user actions)
    if (streakData?.currentStreak === 7) {
      const milestone = milestones.find(m => m.days === 7);
      if (milestone && !streakData.milestonesAchieved.includes(7)) {
        setNewMilestone(milestone);
        onOpen();
        
        // Trigger confetti
        confetti({
          particleCount: 150,
          spread: 100,
          origin: { y: 0.6 },
          colors: ['#38B2AC', '#48BB78', '#ECC94B']
        });
      }
    }
  }, [streakData, milestones, onOpen]);

  if (!streakData || !milestones.length) {
    return (
      <Box bg={cardBg} p={6} borderRadius="xl" shadow="md">
        <Text>Loading participation data...</Text>
      </Box>
    );
  }

  // Find current milestone target
  const nextMilestone = milestones.find(milestone => 
    milestone.days > streakData.currentStreak
  );
  
  const currentMilestoneProgress = nextMilestone 
    ? (streakData.currentStreak / nextMilestone.days) * 100
    : 100;

  return (
    <>
      <VStack spacing={6} w="full">
        {/* Main Streak Display */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          bg={cardBg}
          p={6}
          borderRadius="xl"
          shadow="md"
          w="full"
          borderTop="4px solid"
          borderTopColor="teal.500"
        >
          <VStack spacing={4}>
            <HStack spacing={3} align="center">
              <SafeIcon icon={FiTrendingUp} className="text-2xl text-teal-500" />
              <Heading size="md" color="gray.800">
                Participation Streak
              </Heading>
            </HStack>
            
            <HStack spacing={8} align="center" justify="center">
              <VStack spacing={1}>
                <Text fontSize="4xl" fontWeight="bold" color="teal.500" lineHeight="1">
                  {streakData.currentStreak}
                </Text>
                <Text fontSize="sm" color="gray.600">Current Streak</Text>
              </VStack>
              
              <Box h="50px" w="1px" bg="gray.300" />
              
              <VStack spacing={1}>
                <Text fontSize="2xl" fontWeight="bold" color="gray.700" lineHeight="1">
                  {streakData.longestStreak}
                </Text>
                <Text fontSize="sm" color="gray.600">Personal Best</Text>
              </VStack>
            </HStack>
            
            {nextMilestone && (
              <Box w="full">
                <HStack justify="space-between" mb={2}>
                  <Text fontSize="sm" color="gray.600">
                    Progress to {nextMilestone.title}
                  </Text>
                  <Badge colorScheme="teal" className="text-teal-500">
                    {streakData.currentStreak}/{nextMilestone.days} days
                  </Badge>
                </HStack>
                <Progress 
                  value={currentMilestoneProgress} 
                  size="lg" 
                  colorScheme="teal" 
                  borderRadius="full"
                  bg="gray.200"
                  hasStripe
                  isAnimated
                />
              </Box>
            )}
          </VStack>
        </MotionBox>

        {/* Streak Calendar */}
        <StreakCalendar 
          streakHistory={streakData.streakHistory} 
          currentStreak={streakData.currentStreak}
        />

        {/* Milestones Grid */}
        <Box w="full">
          <VStack spacing={4} align="stretch">
            <HStack spacing={3} align="center">
              <SafeIcon icon={FiStar} className="text-2xl text-yellow-500" />
              <Heading size="md" color="gray.800">
                Streak Milestones
              </Heading>
            </HStack>
            
            <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} spacing={4}>
              {milestones.slice(0, 8).map((milestone, index) => {
                const isAchieved = streakData.milestonesAchieved.includes(milestone.days);
                const isCurrent = !isAchieved && (
                  !nextMilestone || milestone.days === nextMilestone.days
                );
                const progress = isCurrent ? currentMilestoneProgress : 0;
                
                return (
                  <MilestoneCard
                    key={milestone.days}
                    milestone={milestone}
                    isAchieved={isAchieved}
                    isCurrent={isCurrent}
                    progress={progress}
                  />
                );
              })}
            </SimpleGrid>
          </VStack>
        </Box>
      </VStack>

      {/* Milestone Achievement Modal */}
      <ParticipationMilestoneModal
        isOpen={isOpen}
        onClose={onClose}
        milestone={newMilestone}
      />
    </>
  );
};

export default ParticipationStreakTracker;