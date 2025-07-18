import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Progress,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Badge,
  SimpleGrid,
  useColorModeValue
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { UserController } from '../../controllers/UserController';

const { FiUpload, FiCheckCircle, FiCalendar, FiTrendingUp } = FiIcons;

const MotionBox = motion(Box);

const ReceiptUploadStats = () => {
  const [stats, setStats] = useState(null);
  const [milestones, setMilestones] = useState(null);
  const cardBg = useColorModeValue('white', 'gray.700');

  useEffect(() => {
    // Get receipt upload statistics
    const uploadStats = UserController.getReceiptUploadStats();
    const milestonesData = UserController.getReceiptMilestones();
    
    setStats(uploadStats);
    setMilestones(milestonesData);
  }, []);

  if (!stats || !milestones) {
    return (
      <Box bg={cardBg} p={4} borderRadius="lg" shadow="md">
        <Text>Loading receipt statistics...</Text>
      </Box>
    );
  }

  // Calculate progress for daily milestones
  const dailyMilestone5 = milestones.daily.find(m => m.id === 'daily_5');
  const dailyMilestone10 = milestones.daily.find(m => m.id === 'daily_10');
  
  const dailyProgress5 = Math.min(Math.round((stats.dailyUploads / dailyMilestone5.threshold) * 100), 100);
  const dailyProgress10 = Math.min(Math.round((stats.dailyUploads / dailyMilestone10.threshold) * 100), 100);
  
  // Calculate progress for the next total milestone
  const totalMilestones = milestones.total.filter(m => m.threshold > stats.totalUploads);
  const nextTotalMilestone = totalMilestones.length > 0 ? totalMilestones[0] : milestones.total[milestones.total.length - 1];
  const totalProgress = Math.min(Math.round((stats.totalUploads / nextTotalMilestone.threshold) * 100), 100);

  return (
    <VStack spacing={6} align="stretch">
      {/* Main Stats Cards */}
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
        {/* Daily Uploads */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          bg={cardBg}
          p={5}
          borderRadius="lg"
          shadow="md"
          borderLeft="4px solid"
          borderLeftColor="teal.500"
        >
          <Stat>
            <HStack spacing={3} mb={2}>
              <Box color="teal.500">
                <SafeIcon icon={FiUpload} className="text-2xl" />
              </Box>
              <StatLabel fontSize="sm" color="gray.500">Today's Uploads</StatLabel>
            </HStack>
            <StatNumber fontSize="3xl" color="gray.800">{stats.dailyUploads}</StatNumber>
            <StatHelpText>
              <HStack>
                <SafeIcon icon={FiCalendar} className="text-sm" />
                <Text fontSize="sm">Today's Goal: 5 receipts</Text>
              </HStack>
            </StatHelpText>
            
            {/* Daily Progress */}
            <Box mt={2}>
              <HStack justify="space-between" mb={1}>
                <Text fontSize="xs" color="gray.500">Progress to 5 receipts</Text>
                <Badge colorScheme={dailyProgress5 >= 100 ? "green" : "teal"}>
                  {stats.dailyUploads}/5
                </Badge>
              </HStack>
              <Progress 
                value={dailyProgress5} 
                size="sm" 
                colorScheme={dailyProgress5 >= 100 ? "green" : "teal"}
                borderRadius="full"
              />
              
              <HStack justify="space-between" mt={3} mb={1}>
                <Text fontSize="xs" color="gray.500">Progress to 10 receipts</Text>
                <Badge colorScheme={dailyProgress10 >= 100 ? "green" : "blue"}>
                  {stats.dailyUploads}/10
                </Badge>
              </HStack>
              <Progress 
                value={dailyProgress10} 
                size="sm" 
                colorScheme={dailyProgress10 >= 100 ? "green" : "blue"}
                borderRadius="full"
              />
            </Box>
          </Stat>
        </MotionBox>

        {/* Total Uploads */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          bg={cardBg}
          p={5}
          borderRadius="lg"
          shadow="md"
          borderLeft="4px solid"
          borderLeftColor="green.500"
        >
          <Stat>
            <HStack spacing={3} mb={2}>
              <Box color="green.500">
                <SafeIcon icon={FiCheckCircle} className="text-2xl" />
              </Box>
              <StatLabel fontSize="sm" color="gray.500">Total Receipts Uploaded</StatLabel>
            </HStack>
            <StatNumber fontSize="3xl" color="gray.800">{stats.totalUploads}</StatNumber>
            <StatHelpText>
              <HStack>
                <SafeIcon icon={FiTrendingUp} className="text-sm" />
                <Text fontSize="sm">Next Goal: {nextTotalMilestone.threshold} receipts</Text>
              </HStack>
            </StatHelpText>
            
            {/* Total Progress */}
            <Box mt={2}>
              <HStack justify="space-between" mb={1}>
                <Text fontSize="xs" color="gray.500">
                  Progress to {nextTotalMilestone.threshold} receipts
                </Text>
                <Badge colorScheme="green">
                  {stats.totalUploads}/{nextTotalMilestone.threshold}
                </Badge>
              </HStack>
              <Progress 
                value={totalProgress} 
                size="sm" 
                colorScheme="green"
                borderRadius="full"
              />
            </Box>
          </Stat>
        </MotionBox>
      </SimpleGrid>

      {/* Milestones Section */}
      <Box bg={cardBg} p={5} borderRadius="lg" shadow="md">
        <VStack align="start" spacing={4}>
          <Text fontWeight="medium" color="gray.700">Receipt Milestones</Text>
          
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="full">
            {/* Daily Milestones */}
            <VStack align="start" spacing={2}>
              <Text fontSize="sm" fontWeight="medium" color="teal.600">Daily Milestones</Text>
              
              {milestones.daily.map(milestone => {
                const isAchieved = stats.milestones[milestone.id].achieved;
                return (
                  <HStack 
                    key={milestone.id} 
                    bg={isAchieved ? "teal.50" : "gray.50"} 
                    p={2} 
                    borderRadius="md" 
                    w="full"
                    opacity={isAchieved ? 1 : 0.7}
                  >
                    <SafeIcon 
                      icon={isAchieved ? FiCheckCircle : FiUpload} 
                      className={isAchieved ? "text-teal-500" : "text-gray-400"} 
                    />
                    <Text fontSize="sm" fontWeight={isAchieved ? "medium" : "normal"}>
                      {milestone.name}
                    </Text>
                    <Badge ml="auto" colorScheme={isAchieved ? "teal" : "gray"}>
                      {milestone.points} pts
                    </Badge>
                  </HStack>
                );
              })}
            </VStack>
            
            {/* Total Milestones */}
            <VStack align="start" spacing={2}>
              <Text fontSize="sm" fontWeight="medium" color="green.600">Total Milestones</Text>
              
              {milestones.total.map(milestone => {
                const isAchieved = stats.milestones[milestone.id].achieved;
                return (
                  <HStack 
                    key={milestone.id} 
                    bg={isAchieved ? "green.50" : "gray.50"} 
                    p={2} 
                    borderRadius="md" 
                    w="full"
                    opacity={isAchieved ? 1 : 0.7}
                  >
                    <SafeIcon 
                      icon={isAchieved ? FiCheckCircle : FiUpload} 
                      className={isAchieved ? "text-green-500" : "text-gray-400"} 
                    />
                    <Text fontSize="sm" fontWeight={isAchieved ? "medium" : "normal"}>
                      {milestone.name}
                    </Text>
                    <Badge ml="auto" colorScheme={isAchieved ? "green" : "gray"}>
                      {milestone.points} pts
                    </Badge>
                  </HStack>
                );
              })}
            </VStack>
          </SimpleGrid>
        </VStack>
      </Box>
      
      {/* Recent Activity */}
      {stats.recentActivity && stats.recentActivity.length > 0 && (
        <Box bg={cardBg} p={5} borderRadius="lg" shadow="md">
          <VStack align="start" spacing={3}>
            <Text fontWeight="medium" color="gray.700">Recent Upload Activity</Text>
            
            {stats.recentActivity.map((day, index) => (
              <HStack 
                key={index}
                justify="space-between"
                w="full"
                p={2}
                borderRadius="md"
                bg={index === 0 ? "blue.50" : "transparent"}
              >
                <HStack>
                  <SafeIcon icon={FiCalendar} className="text-sm text-gray-400" />
                  <Text fontSize="sm">
                    {index === 0 ? "Today" : index === 1 ? "Yesterday" : day.date}
                  </Text>
                </HStack>
                <HStack>
                  <SafeIcon icon={FiUpload} className="text-sm text-gray-400" />
                  <Text fontSize="sm" fontWeight="medium">
                    {day.uploads} {day.uploads === 1 ? "receipt" : "receipts"}
                  </Text>
                  {day.rewardsEarned && day.rewardsEarned.length > 0 && (
                    <Badge colorScheme="teal" variant="outline" ml={2}>Milestone</Badge>
                  )}
                </HStack>
              </HStack>
            ))}
          </VStack>
        </Box>
      )}
    </VStack>
  );
};

export default ReceiptUploadStats;