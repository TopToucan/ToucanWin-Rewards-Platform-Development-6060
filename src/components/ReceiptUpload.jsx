import React, { useState, useCallback, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Input,
  Button,
  Alert,
  AlertIcon,
  Image,
  Progress,
  HStack,
  useToast,
  Flex,
  VisuallyHidden,
  useDisclosure,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Badge,
  SimpleGrid,
  Divider
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { UserController } from '../controllers/UserController';
import LevelUpModal from './LevelUpModal';
import ReceiptUploadStats from './receipts/ReceiptUploadStats';
import ReceiptMilestoneModal from './receipts/ReceiptMilestoneModal';

const { FiUpload, FiCamera, FiFile, FiCheck, FiAward } = FiIcons;

const MotionBox = motion(Box);
const MotionButton = motion(Button);
const MotionBadge = motion(Badge);

const ReceiptUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [levelUpInfo, setLevelUpInfo] = useState(null);
  const [uploadStats, setUploadStats] = useState(null);
  const [earnedMilestone, setEarnedMilestone] = useState(null);
  
  const { isOpen: isLevelUpOpen, onOpen: onLevelUpOpen, onClose: onLevelUpClose } = useDisclosure();
  const { 
    isOpen: isMilestoneOpen, 
    onOpen: onMilestoneOpen, 
    onClose: onMilestoneClose 
  } = useDisclosure();
  
  const toast = useToast();

  // Fetch receipt upload stats on component mount
  useEffect(() => {
    const stats = UserController.getReceiptUploadStats();
    setUploadStats(stats);
  }, []);

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

    // Get the dropped file
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

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate realistic upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    // Simulate processing delay
    setTimeout(() => {
      clearInterval(progressInterval);
      setUploadProgress(100);

      setTimeout(() => {
        // Process receipt
        const result = UserController.handleReceiptUpload(selectedFile);

        // Update stats
        const updatedStats = UserController.getReceiptUploadStats();
        setUploadStats(updatedStats);

        // Check for level up
        if (result.levelUp) {
          setLevelUpInfo({
            newLevel: result.newLevel,
            previousLevel: result.previousLevel
          });
          setTimeout(() => {
            onLevelUpOpen();
          }, 1000);
        }
        
        // Check for receipt milestones
        if (result.earnedMilestones && result.earnedMilestones.length > 0) {
          setEarnedMilestone(result.earnedMilestones[0]);
          setTimeout(() => {
            onMilestoneOpen();
          }, 500);
        }

        setUploadStatus('Receipt uploaded successfully! Points will be added to your account.');
        setSelectedFile(null);
        setPreviewUrl(null);
        setIsUploading(false);
        setUploadProgress(0);

        // Reset file input
        const fileInput = document.getElementById('receipt-input');
        if (fileInput) {
          fileInput.value = '';
        }

        // Show toast with points earned
        toast({
          title: "Upload Successful!",
          description: `Your receipt has been processed and ${result.pointsEarned} points added${result.milestoneBonusPoints ? ` plus ${result.milestoneBonusPoints} bonus points from milestones` : ''}!`,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      }, 500);
    }, 2000);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Container as="main" role="main" maxW="container.xl" p={{ base: 4, md: 8 }}>
      <MotionBox 
        initial={{ opacity: 0, y: 30 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }}
      >
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8} py={{ base: 6, md: 10 }}>
          {/* Upload Section */}
          <VStack spacing={{ base: 6, md: 8 }} align="stretch">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <VStack spacing={{ base: 2, md: 4 }} textAlign="center">
                <Heading as="h1" size={{ base: "lg", md: "xl" }} color="gray.800" lineHeight="shorter">
                  Upload Receipt
                </Heading>
                <Text fontSize={{ base: "md", md: "lg" }} color="gray.600" maxW="500px" lineHeight="relaxed">
                  Upload your receipt to earn points automatically
                </Text>
                
                {uploadStats && (
                  <HStack>
                    <Badge colorScheme="teal" fontSize="md" px={3} py={1} borderRadius="full">
                      <HStack>
                        <SafeIcon icon={FiUpload} className="text-xs" />
                        <Text>{uploadStats.dailyUploads} today</Text>
                      </HStack>
                    </Badge>
                    
                    {uploadStats.dailyUploads >= 5 && (
                      <MotionBadge
                        colorScheme="green"
                        fontSize="md"
                        px={3}
                        py={1}
                        borderRadius="full"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.5, repeat: 3, repeatType: "mirror" }}
                      >
                        <HStack>
                          <SafeIcon icon={FiAward} className="text-xs" />
                          <Text>Daily Goal Met!</Text>
                        </HStack>
                      </MotionBadge>
                    )}
                  </HStack>
                )}
              </VStack>
            </motion.div>

            <MotionBox 
              as="section" 
              aria-labelledby="upload-section" 
              bg="white" 
              p={{ base: 6, md: 8 }} 
              borderRadius="xl" 
              shadow="md" 
              w="full"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="border-teal-500"
            >
              <VStack spacing={{ base: 4, md: 6 }}>
                <VisuallyHidden>
                  <Heading as="h2" id="upload-section">
                    File Upload Section
                  </Heading>
                </VisuallyHidden>

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
                    p={{ base: 6, md: 8 }} 
                    textAlign="center" 
                    bg={isDragging ? "teal.50" : "gray.50"}
                    transition="all 0.3s"
                    cursor="pointer"
                    position="relative"
                    role="button"
                    tabIndex={0}
                    aria-label="Upload receipt file by clicking or dragging and dropping"
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById('receipt-input')?.click()}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        document.getElementById('receipt-input')?.click();
                      }
                    }}
                    _hover={{
                      borderColor: "teal.500",
                      bg: "teal.50"
                    }}
                    _focus={{
                      outline: '3px solid',
                      outlineColor: 'teal.500',
                      outlineOffset: '2px'
                    }}
                  >
                    <VStack spacing={{ base: 3, md: 4 }}>
                      <motion.div
                        animate={{ 
                          y: isDragging ? -5 : 0,
                          scale: isDragging ? 1.1 : 1
                        }}
                        transition={{ duration: 0.2 }}
                      >
                        <Box 
                          p={{ base: 3, md: 4 }} 
                          bg="teal.50" 
                          borderRadius="full"
                          aria-hidden="true"
                        >
                          <SafeIcon icon={FiUpload} className="text-2xl md:text-3xl text-teal-500" />
                        </Box>
                      </motion.div>

                      <VStack spacing={2}>
                        <Text 
                          fontWeight="semibold" 
                          fontSize={{ base: "md", md: "lg" }}
                          color="gray.700"
                        >
                          Drop your receipt here
                        </Text>
                        <Text 
                          fontSize={{ base: "sm", md: "md" }}
                          color="gray.600"
                        >
                          or click to browse files
                        </Text>
                      </VStack>

                      <HStack 
                        spacing={{ base: 2, md: 4 }} 
                        fontSize={{ base: "xs", md: "sm" }}
                        color="gray.500"
                        flexWrap="wrap"
                        justify="center"
                        role="list"
                        aria-label="Supported file types"
                      >
                        <HStack spacing={1} role="listitem">
                          <SafeIcon icon={FiCamera} aria-hidden="true" />
                          <Text>Photos</Text>
                        </HStack>
                        <HStack spacing={1} role="listitem">
                          <SafeIcon icon={FiFile} aria-hidden="true" />
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
                      aria-label="Choose receipt file to upload"
                      tabIndex={-1}
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
                      role="region"
                      aria-label="File preview"
                    >
                      <Box 
                        border="1px solid" 
                        borderColor="gray.200" 
                        borderRadius="lg" 
                        p={{ base: 4, md: 6 }}
                        bg="gray.50"
                      >
                        <VStack spacing={{ base: 3, md: 4 }}>
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
                            <Flex 
                              justify="space-between" 
                              align="center" 
                              w="full"
                              flexWrap="wrap"
                              gap={2}
                            >
                              <Text 
                                fontSize={{ base: "sm", md: "md" }}
                                fontWeight="medium"
                                color="gray.700"
                                noOfLines={1}
                                flex="1"
                                minW="0"
                              >
                                {selectedFile.name}
                              </Text>
                              <Text 
                                fontSize={{ base: "xs", md: "sm" }}
                                color="gray.500"
                              >
                                {formatFileSize(selectedFile.size)}
                              </Text>
                            </Flex>

                            <AnimatePresence>
                              {isUploading && (
                                <MotionBox 
                                  w="full"
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: 0.3 }}
                                  role="progressbar"
                                  aria-valuenow={uploadProgress}
                                  aria-valuemin={0}
                                  aria-valuemax={100}
                                  aria-label={`Upload progress: ${Math.round(uploadProgress)}%`}
                                >
                                  <Progress 
                                    value={uploadProgress} 
                                    colorScheme="teal"
                                    borderRadius="full"
                                    size="sm"
                                    isAnimated
                                  />
                                  <Text 
                                    fontSize="xs" 
                                    color="gray.500" 
                                    textAlign="center" 
                                    mt={1}
                                    aria-live="polite"
                                  >
                                    Processing receipt... {Math.round(uploadProgress)}%
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
                  size={{ base: "md", md: "lg" }}
                  onClick={handleUpload}
                  isDisabled={!selectedFile || isUploading}
                  isLoading={isUploading}
                  loadingText="Processing..."
                  w="full"
                  leftIcon={<SafeIcon icon={selectedFile ? FiCheck : FiUpload} />}
                  py={{ base: 6, md: 7 }}
                  fontSize={{ base: "md", md: "lg" }}
                  fontWeight="semibold"
                  aria-label={selectedFile ? "Process selected receipt" : "Select a receipt file first"}
                  _focus={{
                    outline: '3px solid',
                    outlineColor: 'teal.300',
                    outlineOffset: '2px'
                  }}
                  whileHover={{ 
                    scale: selectedFile && !isUploading ? 1.02 : 1,
                    boxShadow: selectedFile && !isUploading ? "0 8px 25px rgba(56, 178, 172, 0.3)" : "none"
                  }}
                  whileTap={{ 
                    scale: selectedFile && !isUploading ? 0.98 : 1 
                  }}
                  transition={{ duration: 0.2 }}
                >
                  {selectedFile ? 'Process Receipt' : 'Select Receipt First'}
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
                      role="alert"
                      aria-live="assertive"
                    >
                      <Alert 
                        status={uploadStatus.includes('successfully') ? 'success' : 'error'}
                        borderRadius="md"
                        fontSize={{ base: "sm", md: "md" }}
                      >
                        <AlertIcon />
                        <Text>{uploadStatus}</Text>
                      </Alert>
                    </MotionBox>
                  )}
                </AnimatePresence>

                {/* Help Text */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  style={{ width: '100%' }}
                >
                  <Box 
                    bg="teal.50" 
                    p={{ base: 3, md: 4 }} 
                    borderRadius="md" 
                    w="full"
                    role="region"
                    aria-labelledby="upload-tips"
                  >
                    <VStack spacing={2} textAlign="center">
                      <Text 
                        id="upload-tips"
                        fontSize={{ base: "xs", md: "sm" }}
                        color="gray.700"
                        fontWeight="medium"
                      >
                        💡 Tips for best results:
                      </Text>
                      <VStack 
                        spacing={1} 
                        fontSize={{ base: "xs", md: "sm" }}
                        color="gray.600"
                        align="start"
                        w="full"
                        as="ul"
                        listStyleType="none"
                      >
                        <Text as="li">• Ensure receipt is clearly visible and well-lit</Text>
                        <Text as="li">• Include store name, date, and total amount</Text>
                        <Text as="li">• Max file size: 10MB</Text>
                        <Text as="li">• Supported formats: JPG, PNG, GIF, PDF</Text>
                      </VStack>
                    </VStack>
                  </Box>
                </motion.div>
              </VStack>
            </MotionBox>
          </VStack>

          {/* Stats Section */}
          <MotionBox
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <VStack spacing={{ base: 4, md: 6 }} align="stretch">
              <Heading size="md" color="gray.700">Your Receipt Stats</Heading>
              <ReceiptUploadStats />
            </VStack>
          </MotionBox>
        </SimpleGrid>
      </MotionBox>

      {/* Level Up Modal */}
      {levelUpInfo && (
        <LevelUpModal 
          isOpen={isLevelUpOpen} 
          onClose={onLevelUpClose}
          newLevel={levelUpInfo.newLevel}
          previousLevel={levelUpInfo.previousLevel}
        />
      )}

      {/* Receipt Milestone Modal */}
      {earnedMilestone && (
        <ReceiptMilestoneModal
          isOpen={isMilestoneOpen}
          onClose={onMilestoneClose}
          milestone={earnedMilestone}
          pointsEarned={earnedMilestone.points}
        />
      )}
    </Container>
  );
};

export default ReceiptUpload;