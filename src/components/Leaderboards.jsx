import React from 'react';
import {
  Box,
  Container,
  Heading,
  VStack,
  HStack,
  Text,
  Avatar,
  Badge,
  Tab,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
  SimpleGrid
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiAward, FiTrendingUp, FiTarget } = FiIcons;

const MotionBox = motion(Box);

const LeaderCard = ({ rank, user, score, category }) => (
  <MotionBox
    whileHover={{ y: -2 }}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    bg="white"
    p={4}
    rounded="lg"
    shadow="md"
    borderLeft={rank <= 3 ? "4px solid" : "none"}
    borderLeftColor={
      rank === 1 ? "yellow.400" :
      rank === 2 ? "gray.400" :
      rank === 3 ? "orange.400" : "transparent"
    }
  >
    <HStack spacing={4}>
      <Text
        fontSize="xl"
        fontWeight="bold"
        color={rank <= 3 ? "teal.500" : "gray.500"}
        minW="2rem"
      >
        #{rank}
      </Text>
      <Avatar size="md" name={user.name} src={user.avatar} />
      <VStack align="start" flex={1} spacing={1}>
        <Text fontWeight="bold">{user.name}</Text>
        <HStack>
          <SafeIcon 
            icon={category === 'points' ? FiAward : 
                  category === 'campaigns' ? FiTarget : 
                  FiTrendingUp} 
            className="text-teal-500"
          />
          <Text color="gray.600" fontSize="sm">
            {score} {category === 'points' ? 'pts' : 
                    category === 'campaigns' ? 'completed' : 
                    'auctions won'}
          </Text>
        </HStack>
      </VStack>
      {rank <= 3 && (
        <Badge
          colorScheme={rank === 1 ? "yellow" : rank === 2 ? "gray" : "orange"}
        >
          {rank === 1 ? "Gold" : rank === 2 ? "Silver" : "Bronze"}
        </Badge>
      )}
    </HStack>
  </MotionBox>
);

const Leaderboards = () => {
  const leaderboardData = {
    points: [
      { rank: 1, user: { name: "Sarah Johnson", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100" }, score: 15420 },
      { rank: 2, user: { name: "Michael Chen", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100" }, score: 12850 },
      { rank: 3, user: { name: "Emily Rodriguez", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100" }, score: 11200 },
      { rank: 4, user: { name: "David Kim" }, score: 9800 },
      { rank: 5, user: { name: "Lisa Thompson" }, score: 8900 }
    ],
    campaigns: [
      { rank: 1, user: { name: "Michael Chen", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100" }, score: 45 },
      { rank: 2, user: { name: "Sarah Johnson", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100" }, score: 38 },
      { rank: 3, user: { name: "David Kim" }, score: 32 },
      { rank: 4, user: { name: "Emily Rodriguez", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100" }, score: 29 },
      { rank: 5, user: { name: "Lisa Thompson" }, score: 25 }
    ],
    auctions: [
      { rank: 1, user: { name: "Emily Rodriguez", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100" }, score: 12 },
      { rank: 2, user: { name: "David Kim" }, score: 9 },
      { rank: 3, user: { name: "Sarah Johnson", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100" }, score: 7 },
      { rank: 4, user: { name: "Michael Chen", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100" }, score: 6 },
      { rank: 5, user: { name: "Lisa Thompson" }, score: 4 }
    ]
  };

  return (
    <Container maxW="container.xl" p={8}>
      <VStack spacing={8} align="stretch">
        <Heading size="xl" color="teal.600">Leaderboards</Heading>
        
        <Tabs variant="soft-rounded" colorScheme="teal">
          <TabList>
            <Tab><HStack><SafeIcon icon={FiAward} />Points</HStack></Tab>
            <Tab><HStack><SafeIcon icon={FiTarget} />Campaigns</HStack></Tab>
            <Tab><HStack><SafeIcon icon={FiTrendingUp} />Auctions</HStack></Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
                {leaderboardData.points.map((leader) => (
                  <LeaderCard key={leader.rank} {...leader} category="points" />
                ))}
              </SimpleGrid>
            </TabPanel>
            
            <TabPanel>
              <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
                {leaderboardData.campaigns.map((leader) => (
                  <LeaderCard key={leader.rank} {...leader} category="campaigns" />
                ))}
              </SimpleGrid>
            </TabPanel>
            
            <TabPanel>
              <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
                {leaderboardData.auctions.map((leader) => (
                  <LeaderCard key={leader.rank} {...leader} category="auctions" />
                ))}
              </SimpleGrid>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
    </Container>
  );
};

export default Leaderboards;