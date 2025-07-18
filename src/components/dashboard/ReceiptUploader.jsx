import React, { useState, useCallback } from 'react';
import { 
  Box, 
  VStack, 
  Text, 
  Button, 
  HStack, 
  Progress, 
  useColorModeValue, 
  Badge, 
  Flex, 
  Alert, 
  AlertIcon,
  useToast
} from '@chakra-ui/react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { UserController } from '../../controllers/UserController';

const { FiUpload, FiFileText, FiCheckCircle, FiAlertCircle, FiCamera } = FiIcons;

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

const ReceiptUploader = ({ onPointsEarned }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const toast = useToast();

  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const hoverBgColor = useColorModeValue('gray.50', 'gray.600');

  // Handle file drop
  const onDrop = useCallback((acceptedFiles) => {
    const selectedFile = acceptedFiles[0];
    
    if (selectedFile) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf'];
      if (!validTypes.includes(selectedFile.type)) {
        setUploadStatus({
          status: 'error',
          message: 'Please select a valid image or PDF file'
        });
        return;
      }
      
      // Validate file size (10MB max)
      if (selectedFile.size > 10 * 1024 * 1024) {
        setUploadStatus({
          status: 'error',
          message: 'File size must be less than 10MB'
        });
        return;
      }
      
      setFile(selectedFile);
      setUploadStatus(null);
      
      // Create preview for images
      if (selectedFile.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreview(e.target.result);
        };
        reader.readAsDataURL(selectedFile);
      } else {
        setPreview(null);
      }
    }
  }, []);

  // Configure dropzone
  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.gif'],
      'application/pdf': ['.pdf']
    },
    maxFiles: 1
  });

  // Handle upload
  const handleUpload = async () => {
    if (!file) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    
    // Simulate progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          return prev;
        }
        return prev + Math.random() * 15;
      });
    }, 200);
    
    // Simulate processing delay
    setTimeout(() => {
      clearInterval(interval);
      setUploadProgress(100);
      
      // Process receipt and calculate points
      const result = UserController.processReceipt(file);
      
      setTimeout(() => {
        setIsUploading(false);
        
        if (result.success) {
          // Show success message
          setUploadStatus({
            status: 'success',
            message: `Receipt processed! You've earned ${result.pointsEarned} points.`,
            pointsEarned: result.pointsEarned
          });
          
          // Trigger confetti
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
          
          // Notify parent component
          onPointsEarned(result.pointsEarned);
          
          // Reset form
          setTimeout(() => {
            setFile(null);
            setPreview(null);
            setUploadProgress(0);
          }, 3000);
        } else {
          setUploadStatus({
            status: 'error',
            message: 'There was a problem processing your receipt. Please try again.'
          });
        }
      }, 500);
    }, 2000);
  };

  const getBorderColor = () => {
    if (isDragAccept) return 'green.300';
    if (isDragReject) return 'red.300';
    if (isDragActive) return 'teal.300';
    return borderColor;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <VStack spacing={4} align="stretch">
      {/* Dropzone */}
      <Box
        bg={bgColor}
        borderRadius="xl"
        overflow="hidden"
        shadow="md"
      >
        <MotionBox
          {...getRootProps()}
          border="2px dashed"
          borderColor={getBorderColor()}
          borderRadius="xl"
          p={6}
          cursor="pointer"
          bg={isDragActive ? hoverBgColor : 'transparent'}
          _hover={{ bg: hoverBgColor }}
          transition="all 0.2s"
          textAlign="center"
          animate={{ 
            scale: isDragActive ? 1.02 : 1,
            borderColor: isDragActive ? '#38B2AC' : getBorderColor()
          }}
          whileHover={{ scale: 1.01 }}
        >
          <input {...getInputProps()} />
          
          <VStack spacing={3}>
            <MotionFlex
              justify="center"
              align="center"
              w="70px"
              h="70px"
              borderRadius="full"
              bg="teal.50"
              color="teal.500"
              animate={{ 
                y: isDragActive ? -5 : 0,
                scale: isDragActive ? 1.1 : 1
              }}
              transition={{ duration: 0.2 }}
            >
              <SafeIcon icon={FiUpload} className="text-3xl" />
            </MotionFlex>
            
            <Text fontWeight="bold" fontSize="lg">
              {isDragActive ? 'Drop your receipt here' : 'Drag & drop your receipt'}
            </Text>
            
            <Text fontSize="sm" color="gray.500">
              or click to browse files
            </Text>
            
            <HStack spacing={4} fontSize="sm" color="gray.500" mt={2}>
              <HStack>
                <SafeIcon icon={FiCamera} />
                <Text>Images</Text>
              </HStack>
              <HStack>
                <SafeIcon icon={FiFileText} />
                <Text>PDF</Text>
              </HStack>
            </HStack>
          </VStack>
        </MotionBox>
      </Box>
      
      {/* File Preview */}
      <AnimatePresence>
        {file && (
          <MotionBox
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            overflow="hidden"
          >
            <Box
              bg={bgColor}
              borderRadius="xl"
              p={5}
              shadow="md"
            >
              <VStack spacing={4} align="stretch">
                {/* File Info */}
                <HStack justify="space-between">
                  <HStack spacing={3}>
                    <Box
                      p={2}
                      borderRadius="md"
                      bg="teal.50"
                      color="teal.500"
                    >
                      <SafeIcon icon={file.type.startsWith('image/') ? FiCamera : FiFileText} />
                    </Box>
                    <VStack align="start" spacing={0}>
                      <Text fontWeight="medium" isTruncated maxW="200px">
                        {file.name}
                      </Text>
                      <Text fontSize="xs" color="gray.500">
                        {formatFileSize(file.size)}
                      </Text>
                    </VStack>
                  </HStack>
                  
                  <Badge colorScheme="teal">Ready to upload</Badge>
                </HStack>
                
                {/* Image Preview */}
                {preview && (
                  <MotionBox
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    overflow="hidden"
                    borderRadius="md"
                    maxH="200px"
                    display="flex"
                    justifyContent="center"
                    bg="gray.50"
                  >
                    <Box as="img" 
                      src={preview} 
                      alt="Receipt preview" 
                      maxH="200px" 
                      objectFit="contain"
                    />
                  </MotionBox>
                )}
                
                {/* Progress Bar */}
                {isUploading && (
                  <VStack spacing={1} align="stretch">
                    <Progress
                      value={uploadProgress}
                      size="sm"
                      colorScheme="teal"
                      borderRadius="full"
                      isAnimated
                      hasStripe
                    />
                    <HStack justify="space-between">
                      <Text fontSize="xs" color="gray.500">
                        Processing receipt...
                      </Text>
                      <Text fontSize="xs" fontWeight="bold" color="teal.500">
                        {Math.round(uploadProgress)}%
                      </Text>
                    </HStack>
                  </VStack>
                )}
                
                {/* Upload Button */}
                {!isUploading && !uploadStatus?.success && (
                  <Button
                    colorScheme="teal"
                    leftIcon={<SafeIcon icon={FiUpload} />}
                    onClick={handleUpload}
                    isDisabled={isUploading}
                    w="full"
                  >
                    Process Receipt
                  </Button>
                )}
              </VStack>
            </Box>
          </MotionBox>
        )}
      </AnimatePresence>
      
      {/* Status Messages */}
      <AnimatePresence>
        {uploadStatus && (
          <MotionBox
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <Alert
              status={uploadStatus.status}
              borderRadius="md"
              variant="subtle"
            >
              <AlertIcon />
              <HStack justify="space-between" w="full">
                <Text>{uploadStatus.message}</Text>
                {uploadStatus.status === 'success' && (
                  <Badge colorScheme="green" fontSize="md">
                    +{uploadStatus.pointsEarned} points
                  </Badge>
                )}
              </HStack>
            </Alert>
          </MotionBox>
        )}
      </AnimatePresence>
      
      {/* Tips Section */}
      <Box
        bg="teal.50"
        p={4}
        borderRadius="md"
        mt={2}
      >
        <VStack align="start" spacing={2}>
          <Text fontWeight="medium">💡 Tips for best results:</Text>
          <VStack align="start" spacing={1} fontSize="sm" color="gray.600">
            <Text>• Ensure receipt is clearly visible and well-lit</Text>
            <Text>• Include store name, date, and total amount</Text>
            <Text>• Supported formats: JPG, PNG, PDF</Text>
          </VStack>
        </VStack>
      </Box>
    </VStack>
  );
};

export default ReceiptUploader;