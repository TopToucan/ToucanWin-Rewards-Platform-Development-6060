import React, { useState, useCallback, useEffect } from 'react';
import {
  Box, Container, Heading, Text, VStack, Input, Button, Alert, AlertIcon,
  Progress, HStack, useToast, Flex, VisuallyHidden, useDisclosure,
  SimpleGrid, Badge, Stat, StatLabel, StatNumber, StatHelpText,
  Tabs, TabList, TabPanels, Tab, TabPanel, Image, Divider,
  Table, Thead, Tbody, Tr, Th, Td, TableContainer, Accordion,
  AccordionItem, AccordionButton, AccordionPanel, AccordionIcon
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { AdvancedReceiptController } from '../../controllers/AdvancedReceiptController';

const {
  FiUpload, FiCamera, FiCheck, FiAward, FiDollarSign, FiEye,
  FiShield, FiTrendingUp, FiTarget, FiHeart, FiShoppingBag,
  FiClock, FiMapPin, FiUser, FiBarChart2
} = FiIcons;

const MotionBox = motion(Box);
const MotionButton = motion(Button);

const AdvancedReceiptUploader = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processingResults, setProcessingResults] = useState(null);
  const [receiptAnalytics, setReceiptAnalytics] = useState(null);
  const [bidTokenAnalytics, setBidTokenAnalytics] = useState(null);
  const [insights, setInsights] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  // Load user analytics on component mount
  useEffect(() => {
    loadUserAnalytics();
  }, []);

  const loadUserAnalytics = () => {
    const userId = 1; // Mock user ID
    const analytics = AdvancedReceiptController.getUserReceiptAnalytics(userId);
    const bidTokens = AdvancedReceiptController.getBidTokenAnalytics(userId);
    const userInsights = AdvancedReceiptController.getReceiptInsights(userId);
    
    setReceiptAnalytics(analytics);
    setBidTokenAnalytics(bidTokens);
    setInsights(userInsights);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    processFile(file);
  };

  const processFile = (file) => {
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        setUploadStatus('Please select a valid image or PDF file');
        return;
      }

      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        setUploadStatus('File size must be less than 10MB');
        return;
      }

      setSelectedFile(file);
      setUploadStatus('');
      setProcessingResults(null);

      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => setPreviewUrl(e.target.result);
        reader.readAsDataURL(file);
      } else {
        setPreviewUrl(null);
      }
    }
  };

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      processFile(file);
    }
  }, []);

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadStatus('Please select a file first');
      return;
    }

    setIsProcessing(true);
    setUploadProgress(0);

    // Simulate progress updates
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    try {
      // Process receipt with advanced OCR and analysis
      const result = await AdvancedReceiptController.processReceipt(selectedFile, 1);
      
      clearInterval(progressInterval);
      setUploadProgress(100);

      if (result.success) {
        setProcessingResults(result);
        setUploadStatus('Receipt processed successfully!');
        
        // Show detailed success message
        toast({
          title: "Receipt Processed Successfully!",
          description: `Earned ${result.pointsEarned} points and ${result.bidTokensEarned} bid tokens from ${result.analysis.storeInfo.name}`,
          status: "success",
          duration: 8000,
          isClosable: true,
        });

        // Reload analytics
        loadUserAnalytics();

        // Reset form after delay
        setTimeout(() => {
          setSelectedFile(null);
          setPreviewUrl(null);
          setUploadProgress(0);
          setProcessingResults(null);
          const fileInput = document.getElementById('receipt-input');
          if (fileInput) fileInput.value = '';
        }, 10000); // Keep results visible for 10 seconds

      } else {
        setUploadStatus(`Processing failed: ${result.error}`);
        toast({
          title: "Processing Failed",
          description: result.details || result.error,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      clearInterval(progressInterval);
      setUploadStatus(`Error: ${error.message}`);
      toast({
        title: "Upload Error",
        description: "An unexpected error occurred. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }

    setIsProcessing(false);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Container maxW="container.xl" p={8}>
      <VStack spacing={8} align="stretch">
        <Heading size="xl" color="teal.600">Advanced Receipt Processing</Heading>
        
        <Tabs variant="soft-rounded" colorScheme="teal">
          <TabList>
            <Tab><HStack><SafeIcon icon={FiUpload} /><Text>Upload Receipt</Text></HStack></Tab>
            <Tab><HStack><SafeIcon icon={FiBarChart2} /><Text>Analytics</Text></HStack></Tab>
            <Tab><HStack><SafeIcon icon={FiTarget} /><Text>Bid Tokens</Text></HStack></Tab>
          </TabList>

          <TabPanels>
            {/* Upload Tab */}
            <TabPanel p={0} pt={6}>
              <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
                {/* Upload Section */}
                <VStack spacing={6} align="stretch">
                  <MotionBox
                    bg="white"
                    p={8}
                    borderRadius="xl"
                    shadow="md"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <VStack spacing={6}>
                      {/* Drag & Drop Area */}
                      <motion.div
                        style={{ width: '100%' }}
                        animate={{
                          scale: isDragging ? 1.02 : 1,
                          borderColor: isDragging ? '#38B2AC' : '#E2E8F0'
                        }}
                        transition={{ duration: 0.2 }}
                      >
                        <Box
                          w="full"
                          border="2px dashed"
                          borderColor={isDragging ? "teal.500" : "gray.300"}
                          borderRadius="lg"
                          p={8}
                          textAlign="center"
                          bg={isDragging ? "teal.50" : "gray.50"}
                          transition="all 0.3s"
                          cursor="pointer"
                          position="relative"
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onDrop={handleDrop}
                          onClick={() => document.getElementById('receipt-input')?.click()}
                          _hover={{ borderColor: "teal.500", bg: "teal.50" }}
                        >
                          <VStack spacing={4}>
                            <motion.div
                              animate={{ y: isDragging ? -5 : 0, scale: isDragging ? 1.1 : 1 }}
                              transition={{ duration: 0.2 }}
                            >
                              <Box p={4} bg="teal.50" borderRadius="full">
                                <SafeIcon icon={FiUpload} className="text-3xl text-teal-500" />
                              </Box>
                            </motion.div>
                            <VStack spacing={2}>
                              <Text fontWeight="semibold" fontSize="lg" color="gray.700">
                                Drop your receipt here
                              </Text>
                              <Text fontSize="md" color="gray.600">
                                or click to browse files
                              </Text>
                            </VStack>
                            <HStack spacing={4} fontSize="sm" color="gray.500">
                              <HStack spacing={1}>
                                <SafeIcon icon={FiCamera} />
                                <Text>Photos</Text>
                              </HStack>
                              <HStack spacing={1}>
                                <SafeIcon icon={FiUpload} />
                                <Text>PDF</Text>
                              </HStack>
                            </HStack>
                          </VStack>
                          <Input
                            id="receipt-input"
                            type="file"
                            accept="image/*,.pdf"
                            onChange={handleFileChange}
                            position="absolute"
                            opacity={0}
                            w="full"
                            h="full"
                            cursor="pointer"
                          />
                        </Box>
                      </motion.div>

                      {/* File Preview */}
                      <AnimatePresence>
                        {selectedFile && (
                          <MotionBox
                            w="full"
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -20 }}
                            transition={{ duration: 0.3 }}
                          >
                            <Box border="1px solid" borderColor="gray.200" borderRadius="lg" p={6} bg="gray.50">
                              <VStack spacing={4}>
                                {previewUrl && (
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.3 }}
                                  >
                                    <Image
                                      src={previewUrl}
                                      alt="Receipt preview"
                                      maxH="200px"
                                      borderRadius="md"
                                      objectFit="contain"
                                    />
                                  </motion.div>
                                )}
                                <VStack spacing={2} w="full">
                                  <Flex justify="space-between" align="center" w="full">
                                    <Text fontSize="md" fontWeight="medium" color="gray.700" noOfLines={1}>
                                      {selectedFile.name}
                                    </Text>
                                    <Text fontSize="sm" color="gray.500">
                                      {formatFileSize(selectedFile.size)}
                                    </Text>
                                  </Flex>
                                  <AnimatePresence>
                                    {isProcessing && (
                                      <MotionBox
                                        w="full"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.3 }}
                                      >
                                        <Progress
                                          value={uploadProgress}
                                          colorScheme="teal"
                                          borderRadius="full"
                                          size="sm"
                                          isAnimated
                                        />
                                        <Text fontSize="xs" color="gray.500" textAlign="center" mt={1}>
                                          Processing with advanced OCR... {Math.round(uploadProgress)}%
                                        </Text>
                                      </MotionBox>
                                    )}
                                  </AnimatePresence>
                                </VStack>
                              </VStack>
                            </Box>
                          </MotionBox>
                        )}
                      </AnimatePresence>

                      {/* Upload Button */}
                      <MotionButton
                        colorScheme="teal"
                        size="lg"
                        onClick={handleUpload}
                        isDisabled={!selectedFile || isProcessing}
                        isLoading={isProcessing}
                        loadingText="Processing..."
                        w="full"
                        leftIcon={<SafeIcon icon={selectedFile ? FiCheck : FiUpload} />}
                        py={7}
                        fontSize="lg"
                        fontWeight="semibold"
                        whileHover={{ scale: selectedFile && !isProcessing ? 1.02 : 1 }}
                        whileTap={{ scale: selectedFile && !isProcessing ? 0.98 : 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        {selectedFile ? 'Process Receipt with AI' : 'Select Receipt First'}
                      </MotionButton>

                      {/* Status Alert */}
                      <AnimatePresence>
                        {uploadStatus && (
                          <MotionBox
                            w="full"
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                          >
                            <Alert
                              status={uploadStatus.includes('successfully') ? 'success' : 'error'}
                              borderRadius="md"
                            >
                              <AlertIcon />
                              <Text>{uploadStatus}</Text>
                            </Alert>
                          </MotionBox>
                        )}
                      </AnimatePresence>
                    </VStack>
                  </MotionBox>
                </VStack>

                {/* Processing Results */}
                <VStack spacing={6} align="stretch">
                  {processingResults && (
                    <MotionBox
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <VStack spacing={6} align="stretch">
                        <Heading size="md" color="gray.700">Processing Results</Heading>
                        
                        {/* Rewards Summary */}
                        <Box bg="white" p={6} borderRadius="xl" shadow="md">
                          <VStack spacing={4}>
                            <Heading size="sm" color="teal.600">Rewards Earned</Heading>
                            <SimpleGrid columns={2} spacing={4} w="full">
                              <Stat textAlign="center">
                                <StatLabel fontSize="sm">Points</StatLabel>
                                <StatNumber color="teal.500">{processingResults.pointsEarned}</StatNumber>
                                <StatHelpText>
                                  <SafeIcon icon={FiAward} className="inline mr-1" />
                                  Regular points
                                </StatHelpText>
                              </Stat>
                              <Stat textAlign="center">
                                <StatLabel fontSize="sm">Bid Tokens</StatLabel>
                                <StatNumber color="purple.500">{processingResults.bidTokensEarned}</StatNumber>
                                <StatHelpText>
                                  <SafeIcon icon={FiTarget} className="inline mr-1" />
                                  For auctions
                                </StatHelpText>
                              </Stat>
                            </SimpleGrid>
                          </VStack>
                        </Box>

                        {/* Store Information */}
                        <Box bg="white" p={6} borderRadius="xl" shadow="md">
                          <VStack spacing={4} align="start">
                            <Heading size="sm" color="gray.700">Store Information</Heading>
                            <HStack spacing={4} w="full">
                              <SafeIcon icon={FiShoppingBag} className="text-2xl text-teal-500" />
                              <VStack align="start" spacing={1}>
                                <Text fontWeight="bold">{processingResults.analysis.storeInfo.name}</Text>
                                <Badge colorScheme="teal">{processingResults.analysis.storeInfo.category}</Badge>
                                {processingResults.analysis.storeInfo.partnership && (
                                  <Badge colorScheme="purple">Partner Store</Badge>
                                )}
                              </VStack>
                            </HStack>
                            <SimpleGrid columns={2} spacing={4} w="full">
                              <Box>
                                <Text fontSize="sm" color="gray.500">Total Amount</Text>
                                <Text fontWeight="bold" color="green.600">
                                  {formatCurrency(processingResults.ocrResults.structuredData.total)}
                                </Text>
                              </Box>
                              <Box>
                                <Text fontSize="sm" color="gray.500">Health Score</Text>
                                <Text fontWeight="bold" color={processingResults.analysis.healthScore > 7 ? "green.600" : "orange.600"}>
                                  {processingResults.analysis.healthScore}/10
                                </Text>
                              </Box>
                            </SimpleGrid>
                          </VStack>
                        </Box>

                        {/* Bonus Breakdown */}
                        <Box bg="white" p={6} borderRadius="xl" shadow="md">
                          <VStack spacing={4} align="start">
                            <Heading size="sm" color="gray.700">Bonus Breakdown</Heading>
                            <VStack spacing={2} align="stretch" w="full">
                              <HStack justify="space-between">
                                <Text fontSize="sm">Base Points</Text>
                                <Text fontSize="sm" fontWeight="bold">{processingResults.analysis.businessLogic.basePoints}</Text>
                              </HStack>
                              {processingResults.analysis.businessLogic.bonuses.category > 0 && (
                                <HStack justify="space-between">
                                  <Text fontSize="sm">Category Bonus</Text>
                                  <Text fontSize="sm" fontWeight="bold" color="teal.500">
                                    +{processingResults.analysis.businessLogic.bonuses.category}
                                  </Text>
                                </HStack>
                              )}
                              {processingResults.analysis.businessLogic.bonuses.partnership > 0 && (
                                <HStack justify="space-between">
                                  <Text fontSize="sm">Partnership Bonus</Text>
                                  <Text fontSize="sm" fontWeight="bold" color="purple.500">
                                    +{processingResults.analysis.businessLogic.bonuses.partnership}
                                  </Text>
                                </HStack>
                              )}
                              {processingResults.analysis.businessLogic.bonuses.health > 0 && (
                                <HStack justify="space-between">
                                  <Text fontSize="sm">Health Bonus</Text>
                                  <Text fontSize="sm" fontWeight="bold" color="green.500">
                                    +{processingResults.analysis.businessLogic.bonuses.health}
                                  </Text>
                                </HStack>
                              )}
                            </VStack>
                          </VStack>
                        </Box>

                        {/* Items Detected */}
                        <Box bg="white" p={6} borderRadius="xl" shadow="md">
                          <VStack spacing={4} align="start">
                            <Heading size="sm" color="gray.700">Items Detected</Heading>
                            <TableContainer w="full">
                              <Table size="sm">
                                <Thead>
                                  <Tr>
                                    <Th>Item</Th>
                                    <Th isNumeric>Price</Th>
                                    <Th>Health</Th>
                                  </Tr>
                                </Thead>
                                <Tbody>
                                  {processingResults.ocrResults.structuredData.items.slice(0, 5).map((item, index) => (
                                    <Tr key={index}>
                                      <Td>{item.name}</Td>
                                      <Td isNumeric>{formatCurrency(item.price)}</Td>
                                      <Td>
                                        <Badge colorScheme={item.healthScore > 7 ? "green" : item.healthScore > 5 ? "yellow" : "red"}>
                                          {item.healthScore}/10
                                        </Badge>
                                      </Td>
                                    </Tr>
                                  ))}
                                </Tbody>
                              </Table>
                            </TableContainer>
                          </VStack>
                        </Box>

                        {/* Recommendations */}
                        {processingResults.recommendations && processingResults.recommendations.length > 0 && (
                          <Box bg="blue.50" p={6} borderRadius="xl" border="1px solid" borderColor="blue.200">
                            <VStack spacing={4} align="start">
                              <Heading size="sm" color="blue.700">Personalized Recommendations</Heading>
                              {processingResults.recommendations.map((rec, index) => (
                                <Box key={index} p={3} bg="white" borderRadius="md" w="full">
                                  <Text fontWeight="bold" fontSize="sm" color="blue.700">{rec.title}</Text>
                                  <Text fontSize="sm" color="gray.600">{rec.message}</Text>
                                </Box>
                              ))}
                            </VStack>
                          </Box>
                        )}
                      </VStack>
                    </MotionBox>
                  )}

                  {/* Processing Tips */}
                  <Box bg="teal.50" p={6} borderRadius="xl">
                    <VStack spacing={4} align="start">
                      <Text fontWeight="medium">💡 AI Processing Features:</Text>
                      <VStack spacing={2} align="start" fontSize="sm" color="gray.700">
                        <Text>• Advanced OCR extracts all receipt details</Text>
                        <Text>• Smart fraud detection prevents duplicate uploads</Text>
                        <Text>• Store partnership detection for bonus rewards</Text>
                        <Text>• Health scoring for wellness bonuses</Text>
                        <Text>• Automatic bid token calculation (1 token per $1 spent)</Text>
                      </VStack>
                    </VStack>
                  </Box>
                </VStack>
              </SimpleGrid>
            </TabPanel>

            {/* Analytics Tab */}
            <TabPanel p={0} pt={6}>
              {receiptAnalytics && (
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                  <Stat bg="white" p={6} borderRadius="xl" shadow="md">
                    <StatLabel>Total Receipts</StatLabel>
                    <StatNumber color="teal.500">{receiptAnalytics.totalReceipts}</StatNumber>
                    <StatHelpText>Processed receipts</StatHelpText>
                  </Stat>
                  <Stat bg="white" p={6} borderRadius="xl" shadow="md">
                    <StatLabel>Total Spent</StatLabel>
                    <StatNumber color="green.500">{formatCurrency(receiptAnalytics.totalSpent)}</StatNumber>
                    <StatHelpText>Across all receipts</StatHelpText>
                  </Stat>
                  <Stat bg="white" p={6} borderRadius="xl" shadow="md">
                    <StatLabel>Avg Health Score</StatLabel>
                    <StatNumber color={receiptAnalytics.avgHealthScore > 7 ? "green.500" : "orange.500"}>
                      {receiptAnalytics.avgHealthScore}/10
                    </StatNumber>
                    <StatHelpText>Wellness rating</StatHelpText>
                  </Stat>
                </SimpleGrid>
              )}
            </TabPanel>

            {/* Bid Tokens Tab */}
            <TabPanel p={0} pt={6}>
              {bidTokenAnalytics && (
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                  <Stat bg="white" p={6} borderRadius="xl" shadow="md">
                    <StatLabel>Current Balance</StatLabel>
                    <StatNumber color="purple.500">{bidTokenAnalytics.balance}</StatNumber>
                    <StatHelpText>Available bid tokens</StatHelpText>
                  </Stat>
                  <Stat bg="white" p={6} borderRadius="xl" shadow="md">
                    <StatLabel>Total Earned</StatLabel>
                    <StatNumber color="teal.500">{bidTokenAnalytics.totalEarned}</StatNumber>
                    <StatHelpText>From receipt uploads</StatHelpText>
                  </Stat>
                  <Stat bg="white" p={6} borderRadius="xl" shadow="md">
                    <StatLabel>Total Spent</StatLabel>
                    <StatNumber color="orange.500">{bidTokenAnalytics.totalSpent}</StatNumber>
                    <StatHelpText>On auction bids</StatHelpText>
                  </Stat>
                </SimpleGrid>
              )}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
    </Container>
  );
};

export default AdvancedReceiptUploader;