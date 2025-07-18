import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Badge,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Avatar,
  Progress,
  SimpleGrid,
  useColorModeValue,
  useToast,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Divider,
  Flex,
  Spacer
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { TournamentController } from '../controllers/TournamentController';
import { UserController } from '../controllers/UserController';

const { FiTrophy, FiClock, FiUsers, FiTarget, FiAward, FiCalendar, FiDollarSign, FiTrendingUp } = FiIcons;

const MotionBox = motion(Box);

const CountdownTimer = ({ endDate, onExpire }) => {
  const [timeLeft, setTimeLeft] = useState({ display: '', expired: false });

  useEffect(() => {
    const updateTimer = () => {
      const remaining = TournamentController.calculateTimeRemaining(endDate);
      setTimeLeft(remaining);
      
      if (remaining.expired && onExpire) {
        onExpire();
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [endDate, onExpire]);

  return (
    <HStack spacing={2} align="center">
      <SafeIcon icon={FiClock} className="text-teal-500" />
      <Text 
        fontSize={{ base: "lg", md: "2xl" }} 
        fontWeight="bold" 
        color={timeLeft.expired ? "red.500" : "teal.600"}
        fontFamily="mono"
      >
        {timeLeft.display}
      </Text>
    </HStack>
  );
};

const TournamentCard = ({ tournament, onJoin, user }) => {
  const [isJoining, setIsJoining] = useState(false);
  const cardBg = useColorModeValue('white', 'gray.700');
  const toast = useToast();

  const handleJoin = async () => {
    setIsJoining(true);
    const result = TournamentController.joinTournament(tournament.id, user?.id);
    
    if (result.success) {
      toast({
        title: "Tournament Joined!",
        description: `Welcome to ${tournament.name}! Good luck!`,
        status: "success",
        duration: 4000,
        isClosable: true,
      });
      
      // Trigger celebration confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      
      onJoin(tournament.id);
    } else {
      toast({
        title: "Unable to Join",
        description: result.message,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
    
    setIsJoining(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'green';
      case 'upcoming': return 'blue';
      case 'ended': return 'gray';
      default: return 'gray';
    }
  };

  const participationPercentage = (tournament.currentParticipants / tournament.maxParticipants) * 100;

  return (
    <MotionBox
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      bg={cardBg}
      p={6}
      borderRadius="xl"
      shadow="md"
      _hover={{ shadow: 'lg' }}
      borderTop="4px solid"
      borderTopColor="teal.500"
    >
      <VStack spacing={4} align="stretch">
        {/* Header */}
        <HStack justify="space-between" align="start">
          <VStack align="start" spacing={1}>
            <Heading size="md" color="gray.800" noOfLines={2}>
              {tournament.name}
            </Heading>
            <Text fontSize="sm" color="gray.600" noOfLines={2}>
              {tournament.description}
            </Text>
          </VStack>
          <Badge 
            colorScheme={getStatusColor(tournament.status)} 
            fontSize="sm"
            px={3}
            py={1}
            borderRadius="full"
          >
            {tournament.status.toUpperCase()}
          </Badge>
        </HStack>

        {/* Stats Grid */}
        <SimpleGrid columns={2} spacing={4}>
          <Box>
            <Text fontSize="xs" color="gray.500" mb={1}>Prize Pool</Text>
            <HStack>
              <SafeIcon icon={FiDollarSign} className="text-teal-500 text-sm" />
              <Text fontWeight="bold" color="teal.600">
                {tournament.prizePool.toLocaleString()} pts
              </Text>
            </HStack>
          </Box>
          <Box>
            <Text fontSize="xs" color="gray.500" mb={1}>Entry Fee</Text>
            <Text fontWeight="bold" color={tournament.entryFee > 0 ? "orange.600" : "green.600"}>
              {tournament.entryFee > 0 ? `${tournament.entryFee} pts` : 'FREE'}
            </Text>
          </Box>
        </SimpleGrid>

        {/* Participation Progress */}
        <Box>
          <HStack justify="space-between" mb={2}>
            <Text fontSize="sm" color="gray.600">Participants</Text>
            <Text fontSize="sm" fontWeight="bold">
              {tournament.currentParticipants}/{tournament.maxParticipants}
            </Text>
          </HStack>
          <Progress 
            value={participationPercentage} 
            size="sm" 
            colorScheme="teal" 
            borderRadius="full"
          />
        </Box>

        {/* Countdown Timer */}
        {tournament.status === 'active' && (
          <Box bg="teal.50" p={3} borderRadius="md">
            <Text fontSize="xs" color="gray.600" mb={1}>Time Remaining</Text>
            <CountdownTimer endDate={tournament.endDate} />
          </Box>
        )}

        {tournament.status === 'upcoming' && (
          <Box bg="blue.50" p={3} borderRadius="md">
            <Text fontSize="xs" color="gray.600" mb={1}>Starts</Text>
            <HStack>
              <SafeIcon icon={FiCalendar} className="text-blue-500" />
              <Text fontWeight="bold" color="blue.600">
                {new Date(tournament.startDate).toLocaleDateString()}
              </Text>
            </HStack>
          </Box>
        )}

        {/* Action Button */}
        <Button
          colorScheme="teal"
          leftIcon={<SafeIcon icon={FiTrophy} />}
          onClick={handleJoin}
          isLoading={isJoining}
          isDisabled={tournament.status === 'ended' || participationPercentage >= 100}
          size="md"
          _hover={{ transform: 'translateY(-2px)' }}
        >
          {tournament.status === 'upcoming' ? 'Register Now' : 
           tournament.status === 'active' ? 'Join Tournament' : 
           'Tournament Ended'}
        </Button>
      </VStack>
    </MotionBox>
  );
};

const LeaderboardTable = ({ tournament }) => {
  const headerBg = useColorModeValue('teal.500', 'teal.600');

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `#${rank}`;
    }
  };

  const getRankColor = (rank) => {
    switch (rank) {
      case 1: return 'yellow.400';
      case 2: return 'gray.400';
      case 3: return 'orange.400';
      default: return 'gray.600';
    }
  };

  return (
    <TableContainer>
      <Table variant="simple" size="md">
        <Thead bg={headerBg}>
          <Tr>
            <Th color="white" fontSize="sm">Rank</Th>
            <Th color="white" fontSize="sm">Player</Th>
            <Th color="white" fontSize="sm" isNumeric>Score</Th>
            <Th color="white" fontSize="sm" isNumeric>
              {tournament.type === 'auction' ? 'Wins' : 
               tournament.type === 'points' ? 'Points' : 'Completed'}
            </Th>
            <Th color="white" fontSize="sm" isNumeric>Reward</Th>
          </Tr>
        </Thead>
        <Tbody>
          <AnimatePresence>
            {tournament.leaderboard.map((player, index) => (
              <motion.tr
                key={player.userId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Td>
                  <HStack>
                    <Text 
                      fontSize="lg" 
                      fontWeight="bold" 
                      color={getRankColor(player.rank)}
                    >
                      {getRankIcon(player.rank)}
                    </Text>
                  </HStack>
                </Td>
                <Td>
                  <HStack spacing={3}>
                    <Avatar 
                      size="sm" 
                      src={player.avatar} 
                      name={player.name}
                      border="2px solid"
                      borderColor={player.rank <= 3 ? getRankColor(player.rank) : 'gray.200'}
                    />
                    <Text fontWeight="medium">{player.name}</Text>
                  </HStack>
                </Td>
                <Td isNumeric>
                  <Text fontWeight="bold" color="teal.600">
                    {player.score.toLocaleString()}
                  </Text>
                </Td>
                <Td isNumeric>
                  <Text>
                    {tournament.type === 'auction' ? player.auctionsWon :
                     tournament.type === 'points' ? player.pointsEarned?.toLocaleString() :
                     player.campaignsCompleted || 0}
                  </Text>
                </Td>
                <Td isNumeric>
                  <Badge colorScheme="green" fontSize="sm">
                    {TournamentController.getTournamentRewards(tournament.id, player.rank).toLocaleString()} pts
                  </Badge>
                </Td>
              </motion.tr>
            ))}
          </AnimatePresence>
        </Tbody>
      </Table>
      
      {tournament.leaderboard.length === 0 && (
        <Box textAlign="center" py={8}>
          <Text color="gray.500">No participants yet. Be the first to join!</Text>
        </Box>
      )}
    </TableContainer>
  );
};

const TournamentStats = ({ tournaments }) => {
  const activeTournaments = tournaments.filter(t => t.status === 'active');
  const totalParticipants = tournaments.reduce((sum, t) => sum + t.currentParticipants, 0);
  const totalPrizePool = tournaments.reduce((sum, t) => sum + t.prizePool, 0);

  return (
    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={8}>
      <Box bg="white" p={6} borderRadius="xl" shadow="md">
        <Stat>
          <StatLabel fontSize="sm" color="gray.500">Active Tournaments</StatLabel>
          <StatNumber fontSize="2xl" color="teal.500">{activeTournaments.length}</StatNumber>
          <StatHelpText>Currently running</StatHelpText>
        </Stat>
      </Box>
      
      <Box bg="white" p={6} borderRadius="xl" shadow="md">
        <Stat>
          <StatLabel fontSize="sm" color="gray.500">Total Participants</StatLabel>
          <StatNumber fontSize="2xl" color="teal.500">{totalParticipants}</StatNumber>
          <StatHelpText>Across all tournaments</StatHelpText>
        </Stat>
      </Box>
      
      <Box bg="white" p={6} borderRadius="xl" shadow="md">
        <Stat>
          <StatLabel fontSize="sm" color="gray.500">Total Prize Pool</StatLabel>
          <StatNumber fontSize="2xl" color="teal.500">{totalPrizePool.toLocaleString()}</StatNumber>
          <StatHelpText>Points available to win</StatHelpText>
        </Stat>
      </Box>
    </SimpleGrid>
  );
};

const Tournaments = () => {
  const [tournaments, setTournaments] = useState([]);
  const [user, setUser] = useState(null);
  const [selectedTournament, setSelectedTournament] = useState(null);

  useEffect(() => {
    const userData = UserController.getUser();
    setUser(userData);
    
    const tournamentData = TournamentController.getTournaments();
    setTournaments(tournamentData);
    
    if (tournamentData.length > 0) {
      setSelectedTournament(tournamentData[0]);
    }
  }, []);

  const handleJoinTournament = (tournamentId) => {
    // Update tournaments state to reflect the join
    setTournaments(prev => 
      prev.map(tournament => 
        tournament.id === tournamentId 
          ? { ...tournament, currentParticipants: tournament.currentParticipants + 1 }
          : tournament
      )
    );
  };

  const activeTournaments = tournaments.filter(t => t.status === 'active');
  const upcomingTournaments = tournaments.filter(t => t.status === 'upcoming');

  return (
    <Box>
      {/* Hero Section */}
      <Box bgGradient="linear(to-r, teal.500, teal.400)" color="white" py={12} mb={8}>
        <Container maxW="container.xl">
          <VStack spacing={6} align="center" textAlign="center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <SafeIcon icon={FiTrophy} className="text-6xl" />
            </motion.div>
            <Heading as="h1" size="xl">
              Tournaments & Competitions
            </Heading>
            <Text fontSize="lg" maxW="600px">
              Compete with other players in exciting tournaments to win amazing prizes and climb the leaderboards!
            </Text>
            {user && (
              <Badge colorScheme="white" fontSize="md" px={4} py={2} borderRadius="full">
                Your Points: {user.points.toLocaleString()}
              </Badge>
            )}
          </VStack>
        </Container>
      </Box>

      <Container maxW="container.xl" pb={16}>
        <VStack spacing={10} align="stretch">
          {/* Tournament Stats */}
          <TournamentStats tournaments={tournaments} />

          {/* Tournament Tabs */}
          <Tabs variant="soft-rounded" colorScheme="teal">
            <TabList mb={6}>
              <Tab>
                <HStack>
                  <SafeIcon icon={FiTrendingUp} />
                  <Text>Active Tournaments</Text>
                </HStack>
              </Tab>
              <Tab>
                <HStack>
                  <SafeIcon icon={FiCalendar} />
                  <Text>Upcoming</Text>
                </HStack>
              </Tab>
              <Tab>
                <HStack>
                  <SafeIcon icon={FiTarget} />
                  <Text>Leaderboards</Text>
                </HStack>
              </Tab>
            </TabList>

            <TabPanels>
              {/* Active Tournaments */}
              <TabPanel p={0}>
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                  {activeTournaments.map(tournament => (
                    <TournamentCard
                      key={tournament.id}
                      tournament={tournament}
                      onJoin={handleJoinTournament}
                      user={user}
                    />
                  ))}
                </SimpleGrid>
                
                {activeTournaments.length === 0 && (
                  <Box textAlign="center" py={12}>
                    <VStack spacing={4}>
                      <SafeIcon icon={FiTrophy} className="text-4xl text-gray-400" />
                      <Heading size="md" color="gray.600">No Active Tournaments</Heading>
                      <Text color="gray.500">Check back soon for new competitions!</Text>
                    </VStack>
                  </Box>
                )}
              </TabPanel>

              {/* Upcoming Tournaments */}
              <TabPanel p={0}>
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                  {upcomingTournaments.map(tournament => (
                    <TournamentCard
                      key={tournament.id}
                      tournament={tournament}
                      onJoin={handleJoinTournament}
                      user={user}
                    />
                  ))}
                </SimpleGrid>
                
                {upcomingTournaments.length === 0 && (
                  <Box textAlign="center" py={12}>
                    <VStack spacing={4}>
                      <SafeIcon icon={FiCalendar} className="text-4xl text-gray-400" />
                      <Heading size="md" color="gray-600">No Upcoming Tournaments</Heading>
                      <Text color="gray.500">New tournaments will be announced soon!</Text>
                    </VStack>
                  </Box>
                )}
              </TabPanel>

              {/* Leaderboards */}
              <TabPanel p={0}>
                {activeTournaments.length > 0 ? (
                  <VStack spacing={8} align="stretch">
                    {/* Tournament Selector */}
                    <HStack spacing={4} flexWrap="wrap">
                      {activeTournaments.map(tournament => (
                        <Button
                          key={tournament.id}
                          variant={selectedTournament?.id === tournament.id ? "solid" : "outline"}
                          colorScheme="teal"
                          onClick={() => setSelectedTournament(tournament)}
                          size="sm"
                        >
                          {tournament.name}
                        </Button>
                      ))}
                    </HStack>

                    {/* Selected Tournament Leaderboard */}
                    {selectedTournament && (
                      <MotionBox
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        bg="white"
                        borderRadius="xl"
                        shadow="md"
                        overflow="hidden"
                      >
                        <Box p={6} bg="teal.500" color="white">
                          <Flex align="center">
                            <VStack align="start" spacing={1}>
                              <Heading size="md">{selectedTournament.name}</Heading>
                              <Text opacity={0.9}>{selectedTournament.description}</Text>
                            </VStack>
                            <Spacer />
                            <VStack align="end" spacing={1}>
                              <Text fontSize="sm" opacity={0.8}>Prize Pool</Text>
                              <Text fontSize="xl" fontWeight="bold">
                                {selectedTournament.prizePool.toLocaleString()} pts
                              </Text>
                            </VStack>
                          </Flex>
                        </Box>
                        
                        <Box p={6}>
                          <LeaderboardTable tournament={selectedTournament} />
                        </Box>
                      </MotionBox>
                    )}
                  </VStack>
                ) : (
                  <Box textAlign="center" py={12}>
                    <VStack spacing={4}>
                      <SafeIcon icon={FiTarget} className="text-4xl text-gray-400" />
                      <Heading size="md" color="gray-600">No Active Leaderboards</Heading>
                      <Text color="gray.500">Join an active tournament to see leaderboards!</Text>
                    </VStack>
                  </Box>
                )}
              </TabPanel>
            </TabPanels>
          </Tabs>
        </VStack>
      </Container>
    </Box>
  );
};

export default Tournaments;