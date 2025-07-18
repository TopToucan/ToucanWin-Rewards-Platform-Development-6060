import React, { useState, useEffect } from 'react';
import {
  Box, Container, Heading, Text, VStack, HStack, SimpleGrid,
  Stat, StatLabel, StatNumber, StatHelpText, StatArrow, Badge,
  Progress, Alert, AlertIcon, Tabs, TabList, TabPanels, Tab, TabPanel,
  Table, Thead, Tbody, Tr, Th, Td, TableContainer, useColorModeValue
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { AdvancedReceiptController } from '../../controllers/AdvancedReceiptController';

const {
  FiTrendingUp, FiShoppingBag, FiHeart, FiDollarSign, FiBarChart2,
  FiTarget, FiAward, FiMapPin, FiCalendar, FiPieChart
} = FiIcons;

const MotionBox = motion(Box);

const ReceiptInsightsDashboard = ({ userId = 1 }) => {
  const [insights, setInsights] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const cardBg = useColorModeValue('white', 'gray.700');

  useEffect(() => {
    loadInsights();
  }, [userId]);

  const loadInsights = () => {
    const userInsights = AdvancedReceiptController.getReceiptInsights(userId);
    const userAnalytics = AdvancedReceiptController.getUserReceiptAnalytics(userId);
    setInsights(userInsights);
    setAnalytics(userAnalytics);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getHealthScoreColor = (score) => {
    if (score >= 8) return 'green';
    if (score >= 6) return 'yellow';
    return 'red';
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'increasing': return FiTrendingUp;
      case 'decreasing': return FiTrendingUp; // Will be rotated for decrease
      default: return FiBarChart2;
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'increasing': return 'green';
      case 'decreasing': return 'red';
      default: return 'gray';
    }
  };

  if (!insights || !analytics) {
    return (
      <Container maxW="container.xl" p={8}>
        <Text>Loading receipt insights...</Text>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" p={8}>
      <VStack spacing={8} align="stretch">
        <Heading size="xl" color="teal.600">Receipt Analytics & Insights</Heading>

        {/* Summary Stats */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Stat bg={cardBg} p={6} borderRadius="xl" shadow="md">
              <StatLabel fontSize="sm" color="gray.500">Total Receipts</StatLabel>
              <StatNumber fontSize="3xl" color="teal.500">{insights.summary.totalReceipts}</StatNumber>
              <StatHelpText>
                <SafeIcon icon={FiShoppingBag} className="inline mr-1" />
                Processed receipts
              </StatHelpText>
            </Stat>
          </MotionBox>

          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Stat bg={cardBg} p={6} borderRadius="xl" shadow="md">
              <StatLabel fontSize="sm" color="gray.500">Total Spent</StatLabel>
              <StatNumber fontSize="2xl" color="green.500">{formatCurrency(insights.summary.totalSpent)}</StatNumber>
              <StatHelpText>
                <StatArrow type={insights.trends.spendingTrend.trend === 'increasing' ? 'increase' : 'decrease'} />
                {Math.abs(insights.trends.spendingTrend.change)}% this month
              </StatHelpText>
            </Stat>
          </MotionBox>

          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Stat bg={cardBg} p={6} borderRadius="xl" shadow="md">
              <StatLabel fontSize="sm" color="gray.500">Avg Health Score</StatLabel>
              <StatNumber fontSize="3xl" color={`${getHealthScoreColor(insights.health.avgHealthScore)}.500`}>
                {insights.health.avgHealthScore}/10
              </StatNumber>
              <StatHelpText>
                <StatArrow type={insights.health.healthTrend.trend === 'improving' ? 'increase' : 'decrease'} />
                {insights.health.healthTrend.trend} trend
              </StatHelpText>
            </Stat>
          </MotionBox>

          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <Stat bg={cardBg} p={6} borderRadius="xl" shadow="md">
              <StatLabel fontSize="sm" color="gray.500">Bid Tokens</StatLabel>
              <StatNumber fontSize="3xl" color="purple.500">{insights.summary.currentBidTokenBalance}</StatNumber>
              <StatHelpText>
                <SafeIcon icon={FiTarget} className="inline mr-1" />
                Available for auctions
              </StatHelpText>
            </Stat>
          </MotionBox>
        </SimpleGrid>

        <Tabs variant="soft-rounded" colorScheme="teal">
          <TabList>
            <Tab><HStack><SafeIcon icon={FiPieChart} /><Text>Categories</Text></HStack></Tab>
            <Tab><HStack><SafeIcon icon={FiMapPin} /><Text>Stores</Text></HStack></Tab>
            <Tab><HStack><SafeIcon icon={FiHeart} /><Text>Health</Text></HStack></Tab>
            <Tab><HStack><SafeIcon icon={FiBarChart2} /><Text>Trends</Text></HStack></Tab>
          </TabList>

          <TabPanels>
            {/* Category Analysis */}
            <TabPanel p={0} pt={6}>
              <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
                <Box bg={cardBg} p={6} borderRadius="xl" shadow="md">
                  <VStack spacing={4} align="stretch">
                    <Heading size="md" color="gray.700">Spending by Category</Heading>
                    {insights.trends.topCategories.map(([category, amount], index) => (
                      <Box key={category} p={3} bg="gray.50" borderRadius="md">
                        <HStack justify="space-between" mb={2}>
                          <Text fontWeight="medium" textTransform="capitalize">{category}</Text>
                          <Text fontWeight="bold" color="teal.600">{formatCurrency(amount)}</Text>
                        </HStack>
                        <Progress
                          value={(amount / insights.summary.totalSpent) * 100}
                          colorScheme="teal"
                          size="sm"
                          borderRadius="full"
                        />
                        <Text fontSize="xs" color="gray.500" mt={1}>
                          {Math.round((amount / insights.summary.totalSpent) * 100)}% of total spending
                        </Text>
                      </Box>
                    ))}
                  </VStack>
                </Box>

                <Box bg={cardBg} p={6} borderRadius="xl" shadow="md">
                  <VStack spacing={4} align="stretch">
                    <Heading size="md" color="gray.700">Category Insights</Heading>
                    <Alert status="info" borderRadius="md">
                      <AlertIcon />
                      <VStack align="start" spacing={1}>
                        <Text fontWeight="bold">Smart Spending Detected</Text>
                        <Text fontSize="sm">
                          Your grocery spending is well-balanced. Consider partner stores for bonus tokens!
                        </Text>
                      </VStack>
                    </Alert>
                    
                    {Object.entries(analytics.categorySpending).length > 3 && (
                      <Alert status="success" borderRadius="md">
                        <AlertIcon />
                        <VStack align="start" spacing={1}>
                          <Text fontWeight="bold">Diverse Shopping</Text>
                          <Text fontSize="sm">
                            You shop across {Object.keys(analytics.categorySpending).length} different categories. Great for maximizing rewards!
                          </Text>
                        </VStack>
                      </Alert>
                    )}
                  </VStack>
                </Box>
              </SimpleGrid>
            </TabPanel>

            {/* Store Analysis */}
            <TabPanel p={0} pt={6}>
              <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
                <Box bg={cardBg} p={6} borderRadius="xl" shadow="md">
                  <VStack spacing={4} align="stretch">
                    <Heading size="md" color="gray.700">Frequent Stores</Heading>
                    <TableContainer>
                      <Table size="sm">
                        <Thead>
                          <Tr>
                            <Th>Store</Th>
                            <Th isNumeric>Visits</Th>
                            <Th>Status</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {insights.trends.frequentStores.map(([store, visits]) => (
                            <Tr key={store}>
                              <Td>
                                <Text fontWeight="medium">{store}</Text>
                              </Td>
                              <Td isNumeric>
                                <Badge colorScheme="teal">{visits}</Badge>
                              </Td>
                              <Td>
                                <Badge colorScheme={store.toLowerCase().includes('walmart') || store.toLowerCase().includes('target') ? 'purple' : 'gray'}>
                                  {store.toLowerCase().includes('walmart') || store.toLowerCase().includes('target') ? 'Partner' : 'Regular'}
                                </Badge>
                              </Td>
                            </Tr>
                          ))}
                        </Tbody>
                      </Table>
                    </TableContainer>
                  </VStack>
                </Box>

                <Box bg={cardBg} p={6} borderRadius="xl" shadow="md">
                  <VStack spacing={4} align="stretch">
                    <Heading size="md" color="gray.700">Store Recommendations</Heading>
                    {insights.recommendations
                      .filter(rec => rec.type === 'partnership')
                      .map((rec, index) => (
                        <Alert key={index} status="info" borderRadius="md">
                          <AlertIcon />
                          <VStack align="start" spacing={1}>
                            <Text fontWeight="bold">{rec.title}</Text>
                            <Text fontSize="sm">{rec.message}</Text>
                            <Text fontSize="xs" color="gray.600">{rec.potential}</Text>
                          </VStack>
                        </Alert>
                      ))}
                  </VStack>
                </Box>
              </SimpleGrid>
            </TabPanel>

            {/* Health Analysis */}
            <TabPanel p={0} pt={6}>
              <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
                <Box bg={cardBg} p={6} borderRadius="xl" shadow="md">
                  <VStack spacing={4} align="stretch">
                    <Heading size="md" color="gray.700">Health Score Analysis</Heading>
                    <Box p={4} bg={`${getHealthScoreColor(insights.health.avgHealthScore)}.50`} borderRadius="md">
                      <HStack justify="center" spacing={4}>
                        <VStack>
                          <Text fontSize="3xl" fontWeight="bold" color={`${getHealthScoreColor(insights.health.avgHealthScore)}.600`}>
                            {insights.health.avgHealthScore}
                          </Text>
                          <Text fontSize="sm" color="gray.600">Overall Score</Text>
                        </VStack>
                        <VStack>
                          <Text fontSize="2xl" fontWeight="bold" color="green.600">
                            {insights.health.healthyItems}
                          </Text>
                          <Text fontSize="sm" color="gray.600">Healthy Items</Text>
                        </VStack>
                      </HStack>
                    </Box>
                    
                    <Progress
                      value={insights.health.avgHealthScore * 10}
                      colorScheme={getHealthScoreColor(insights.health.avgHealthScore)}
                      size="lg"
                      borderRadius="full"
                    />
                    
                    <Text fontSize="sm" color="gray.600" textAlign="center">
                      Health Trend: <Badge colorScheme={getTrendColor(insights.health.healthTrend.trend)}>
                        {insights.health.healthTrend.trend}
                      </Badge>
                    </Text>
                  </VStack>
                </Box>

                <Box bg={cardBg} p={6} borderRadius="xl" shadow="md">
                  <VStack spacing={4} align="stretch">
                    <Heading size="md" color="gray.700">Health Recommendations</Heading>
                    {insights.recommendations
                      .filter(rec => rec.type === 'health')
                      .map((rec, index) => (
                        <Alert key={index} status="warning" borderRadius="md">
                          <AlertIcon />
                          <VStack align="start" spacing={1}>
                            <Text fontWeight="bold">{rec.title}</Text>
                            <Text fontSize="sm">{rec.message}</Text>
                            <Text fontSize="xs" color="gray.600">{rec.potential}</Text>
                          </VStack>
                        </Alert>
                      ))}
                    
                    <Box p={4} bg="green.50" borderRadius="md">
                      <VStack spacing={2} align="start">
                        <Text fontWeight="bold" color="green.700">Health Bonus Tips</Text>
                        <Text fontSize="sm" color="gray.700">
                          • Buy more fruits and vegetables for health bonuses
                          • Organic products often have higher health scores
                          • Avoid processed foods to maintain good scores
                        </Text>
                      </VStack>
                    </Box>
                  </VStack>
                </Box>
              </SimpleGrid>
            </TabPanel>

            {/* Trends Analysis */}
            <TabPanel p={0} pt={6}>
              <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
                <Box bg={cardBg} p={6} borderRadius="xl" shadow="md">
                  <VStack spacing={4} align="stretch">
                    <Heading size="md" color="gray.700">Spending Trends</Heading>
                    <HStack justify="center" spacing={8}>
                      <VStack>
                        <SafeIcon icon={getTrendIcon(insights.trends.spendingTrend.trend)} 
                          className={`text-3xl text-${getTrendColor(insights.trends.spendingTrend.trend)}-500`} />
                        <Text fontSize="lg" fontWeight="bold" color={`${getTrendColor(insights.trends.spendingTrend.trend)}.600`}>
                          {Math.abs(insights.trends.spendingTrend.change)}%
                        </Text>
                        <Text fontSize="sm" color="gray.600" textTransform="capitalize">
                          {insights.trends.spendingTrend.trend}
                        </Text>
                      </VStack>
                    </HStack>
                    
                    <Alert status={insights.trends.spendingTrend.trend === 'increasing' ? 'warning' : 'success'} borderRadius="md">
                      <AlertIcon />
                      <Text fontSize="sm">
                        {insights.trends.spendingTrend.trend === 'increasing' 
                          ? 'Your spending has increased this month. Consider budgeting strategies.'
                          : 'Great job managing your spending this month!'}
                      </Text>
                    </Alert>
                  </VStack>
                </Box>

                <Box bg={cardBg} p={6} borderRadius="xl" shadow="md">
                  <VStack spacing={4} align="stretch">
                    <Heading size="md" color="gray.700">Monthly Breakdown</Heading>
                    {Object.entries(analytics.monthlySpending).map(([month, amount]) => (
                      <Box key={month} p={3} bg="gray.50" borderRadius="md">
                        <HStack justify="space-between" mb={2}>
                          <Text fontWeight="medium">{new Date(month + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</Text>
                          <Text fontWeight="bold" color="teal.600">{formatCurrency(amount)}</Text>
                        </HStack>
                        <Progress
                          value={(amount / Math.max(...Object.values(analytics.monthlySpending))) * 100}
                          colorScheme="teal"
                          size="sm"
                          borderRadius="full"
                        />
                      </Box>
                    ))}
                  </VStack>
                </Box>
              </SimpleGrid>
            </TabPanel>
          </TabPanels>
        </Tabs>

        {/* Personalized Recommendations */}
        <Box bg="blue.50" p={6} borderRadius="xl" border="1px solid" borderColor="blue.200">
          <VStack spacing={4} align="stretch">
            <Heading size="md" color="blue.700">Personalized Recommendations</Heading>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              {insights.recommendations.map((rec, index) => (
                <Box key={index} p={4} bg="white" borderRadius="md" shadow="sm">
                  <VStack align="start" spacing={2}>
                    <Badge colorScheme="blue" textTransform="capitalize">{rec.type}</Badge>
                    <Text fontWeight="bold" color="blue.700">{rec.title}</Text>
                    <Text fontSize="sm" color="gray.700">{rec.message}</Text>
                    {rec.potential && (
                      <Text fontSize="xs" color="blue.600" fontWeight="medium">
                        💡 {rec.potential}
                      </Text>
                    )}
                  </VStack>
                </Box>
              ))}
            </SimpleGrid>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
};

export default ReceiptInsightsDashboard;