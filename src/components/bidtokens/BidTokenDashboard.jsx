import React, { useState, useEffect } from 'react';
import {
  Box, Container, Heading, Text, VStack, HStack, SimpleGrid,
  Stat, StatLabel, StatNumber, StatHelpText, Badge, Button,
  Table, Thead, Tbody, Tr, Th, Td, TableContainer, Progress,
  useColorModeValue, Flex, Spacer, Alert, AlertIcon
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { AdvancedReceiptController } from '../../controllers/AdvancedReceiptController';

const { FiTarget, FiTrendingUp, FiDollarSign, FiAward, FiShoppingBag, FiClock } = FiIcons;

const MotionBox = motion(Box);

const BidTokenDashboard = ({ userId = 1 }) => {
  const [bidTokenData, setBidTokenData] = useState(null);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const cardBg = useColorModeValue('white', 'gray.700');

  useEffect(() => {
    loadBidTokenData();
  }, [userId]);

  const loadBidTokenData = () => {
    const analytics = AdvancedReceiptController.getBidTokenAnalytics(userId);
    setBidTokenData(analytics);
    setRecentTransactions(analytics.recentTransactions || []);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getTransactionIcon = (type, source) => {
    if (type === 'earned') {
      if (source === 'receipt_processing') return FiShoppingBag;
      return FiAward;
    }
    return FiTarget;
  };

  const getTransactionColor = (type) => {
    return type === 'earned' ? 'green' : 'orange';
  };

  if (!bidTokenData) {
    return (
      <Container maxW="container.xl" p={8}>
        <Text>Loading bid token data...</Text>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" p={8}>
      <VStack spacing={8} align="stretch">
        <Heading size="xl" color="purple.600">Bid Token Dashboard</Heading>

        {/* Overview Stats */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Stat bg={cardBg} p={6} borderRadius="xl" shadow="md" borderLeft="4px solid" borderLeftColor="purple.500">
              <StatLabel fontSize="sm" color="gray.500">Current Balance</StatLabel>
              <StatNumber fontSize="3xl" color="purple.500">{bidTokenData.balance}</StatNumber>
              <StatHelpText>
                <SafeIcon icon={FiTarget} className="inline mr-1" />
                Available for bidding
              </StatHelpText>
            </Stat>
          </MotionBox>

          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Stat bg={cardBg} p={6} borderRadius="xl" shadow="md" borderLeft="4px solid" borderLeftColor="green.500">
              <StatLabel fontSize="sm" color="gray.500">Total Earned</StatLabel>
              <StatNumber fontSize="3xl" color="green.500">{bidTokenData.totalEarned}</StatNumber>
              <StatHelpText>
                <SafeIcon icon={FiTrendingUp} className="inline mr-1" />
                From all sources
              </StatHelpText>
            </Stat>
          </MotionBox>

          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Stat bg={cardBg} p={6} borderRadius="xl" shadow="md" borderLeft="4px solid" borderLeftColor="orange.500">
              <StatLabel fontSize="sm" color="gray.500">Total Spent</StatLabel>
              <StatNumber fontSize="3xl" color="orange.500">{bidTokenData.totalSpent}</StatNumber>
              <StatHelpText>
                <SafeIcon icon={FiDollarSign} className="inline mr-1" />
                On auction bids
              </StatHelpText>
            </Stat>
          </MotionBox>

          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <Stat bg={cardBg} p={6} borderRadius="xl" shadow="md" borderLeft="4px solid" borderLeftColor="teal.500">
              <StatLabel fontSize="sm" color="gray.500">Avg per Receipt</StatLabel>
              <StatNumber fontSize="3xl" color="teal.500">{bidTokenData.averageEarningPerReceipt}</StatNumber>
              <StatHelpText>
                <SafeIcon icon={FiShoppingBag} className="inline mr-1" />
                Tokens per receipt
              </StatHelpText>
            </Stat>
          </MotionBox>
        </SimpleGrid>

        {/* Earning Sources Breakdown */}
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
          <Box bg={cardBg} p={6} borderRadius="xl" shadow="md">
            <VStack spacing={4} align="stretch">
              <Heading size="md" color="gray.700">Earning Sources</Heading>
              {Object.entries(bidTokenData.earningSources).map(([source, amount]) => (
                <Box key={source} p={3} bg="gray.50" borderRadius="md">
                  <Flex align="center">
                    <VStack align="start" spacing={0}>
                      <Text fontWeight="medium" textTransform="capitalize">
                        {source.replace('_', ' ')}
                      </Text>
                      <Text fontSize="sm" color="gray.600">
                        {amount} tokens earned
                      </Text>
                    </VStack>
                    <Spacer />
                    <Badge colorScheme="green" fontSize="md">
                      {amount}
                    </Badge>
                  </Flex>
                </Box>
              ))}
            </VStack>
          </Box>

          <Box bg={cardBg} p={6} borderRadius="xl" shadow="md">
            <VStack spacing={4} align="stretch">
              <Heading size="md" color="gray.700">Usage Breakdown</Heading>
              {Object.entries(bidTokenData.spendingPurposes).length > 0 ? (
                Object.entries(bidTokenData.spendingPurposes).map(([purpose, amount]) => (
                  <Box key={purpose} p={3} bg="gray.50" borderRadius="md">
                    <Flex align="center">
                      <VStack align="start" spacing={0}>
                        <Text fontWeight="medium" textTransform="capitalize">
                          {purpose.replace('_', ' ')}
                        </Text>
                        <Text fontSize="sm" color="gray.600">
                          {amount} tokens spent
                        </Text>
                      </VStack>
                      <Spacer />
                      <Badge colorScheme="orange" fontSize="md">
                        {amount}
                      </Badge>
                    </Flex>
                  </Box>
                ))
              ) : (
                <Alert status="info" borderRadius="md">
                  <AlertIcon />
                  <Text>No bid tokens spent yet. Start bidding in auctions!</Text>
                </Alert>
              )}
            </VStack>
          </Box>
        </SimpleGrid>

        {/* How Bid Tokens Work */}
        <Box bg="purple.50" p={6} borderRadius="xl" border="1px solid" borderColor="purple.200">
          <VStack spacing={4} align="start">
            <Heading size="md" color="purple.700">How Bid Tokens Work</Heading>
            <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={6} w="full">
              <VStack align="start" spacing={2}>
                <HStack>
                  <SafeIcon icon={FiShoppingBag} className="text-purple-500" />
                  <Text fontWeight="bold" color="purple.700">Earn Tokens</Text>
                </HStack>
                <Text fontSize="sm" color="gray.700">
                  Earn 1 bid token for every $1 spent on receipts. Partner stores may offer bonus tokens.
                </Text>
              </VStack>
              <VStack align="start" spacing={2}>
                <HStack>
                  <SafeIcon icon={FiTarget} className="text-purple-500" />
                  <Text fontWeight="bold" color="purple.700">Use in Auctions</Text>
                </HStack>
                <Text fontSize="sm" color="gray.700">
                  Use bid tokens to place bids in live auctions. Higher bids increase your chances of winning.
                </Text>
              </VStack>
              <VStack align="start" spacing={2}>
                <HStack>
                  <SafeIcon icon={FiAward} className="text-purple-500" />
                  <Text fontWeight="bold" color="purple.700">Win Rewards</Text>
                </HStack>
                <Text fontSize="sm" color="gray.700">
                  Win exclusive items and experiences that you can't buy with regular points.
                </Text>
              </VStack>
            </SimpleGrid>
          </VStack>
        </Box>

        {/* Recent Transactions */}
        <Box bg={cardBg} p={6} borderRadius="xl" shadow="md">
          <VStack spacing={4} align="stretch">
            <HStack justify="space-between">
              <Heading size="md" color="gray.700">Recent Transactions</Heading>
              <Button size="sm" variant="outline" colorScheme="purple">
                View All
              </Button>
            </HStack>
            
            {recentTransactions.length > 0 ? (
              <TableContainer>
                <Table size="md">
                  <Thead>
                    <Tr>
                      <Th>Type</Th>
                      <Th>Source/Purpose</Th>
                      <Th isNumeric>Amount</Th>
                      <Th isNumeric>Balance</Th>
                      <Th>Date</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {recentTransactions.slice(0, 10).map((transaction) => (
                      <Tr key={transaction.id}>
                        <Td>
                          <HStack>
                            <SafeIcon
                              icon={getTransactionIcon(transaction.type, transaction.source || transaction.purpose)}
                              className={`text-${getTransactionColor(transaction.type)}-500`}
                            />
                            <Badge colorScheme={getTransactionColor(transaction.type)}>
                              {transaction.type}
                            </Badge>
                          </HStack>
                        </Td>
                        <Td>
                          <Text fontSize="sm" textTransform="capitalize">
                            {(transaction.source || transaction.purpose || '').replace('_', ' ')}
                          </Text>
                          {transaction.metadata?.storeName && (
                            <Text fontSize="xs" color="gray.500">
                              {transaction.metadata.storeName}
                            </Text>
                          )}
                        </Td>
                        <Td isNumeric>
                          <Text fontWeight="bold" color={getTransactionColor(transaction.type) + '.500'}>
                            {transaction.type === 'earned' ? '+' : '-'}{transaction.amount}
                          </Text>
                        </Td>
                        <Td isNumeric>
                          <Text fontWeight="medium">
                            {transaction.balance}
                          </Text>
                        </Td>
                        <Td>
                          <Text fontSize="sm" color="gray.600">
                            {new Date(transaction.timestamp).toLocaleDateString()}
                          </Text>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            ) : (
              <Alert status="info" borderRadius="md">
                <AlertIcon />
                <Text>No transactions yet. Upload receipts to start earning bid tokens!</Text>
              </Alert>
            )}
          </VStack>
        </Box>

        {/* Call to Action */}
        <Box bg="gradient-to-r from-purple-500 to-teal-500" p={8} borderRadius="xl" color="white" textAlign="center">
          <VStack spacing={4}>
            <Heading size="lg">Ready to Use Your Bid Tokens?</Heading>
            <Text fontSize="lg" opacity={0.9}>
              You have {bidTokenData.balance} bid tokens ready to use in live auctions!
            </Text>
            <HStack spacing={4}>
              <Button colorScheme="whiteAlpha" size="lg" leftIcon={<SafeIcon icon={FiTarget} />}>
                Browse Auctions
              </Button>
              <Button variant="outline" colorScheme="whiteAlpha" size="lg" leftIcon={<SafeIcon icon={FiShoppingBag} />}>
                Upload Receipt
              </Button>
            </HStack>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
};

export default BidTokenDashboard;