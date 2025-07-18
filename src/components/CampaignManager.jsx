import React, { useState } from 'react';
import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  VStack,
  HStack,
  Text,
  Button,
  Badge,
  Input,
  FormControl,
  FormLabel,
  Select,
  useToast,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiPlus, FiEdit2, FiTrash2, FiCalendar, FiUsers, FiTrendingUp } = FiIcons;

const MotionBox = motion(Box);

const CampaignCard = ({ campaign, onEdit, onDelete }) => {
  const statusColor = {
    'Active': 'green',
    'Paused': 'orange',
    'Draft': 'gray',
    'Completed': 'blue'
  };

  return (
    <MotionBox
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      bg="white"
      p={6}
      borderRadius="xl"
      shadow="md"
      borderTop="4px solid"
      borderTopColor="teal.500"
    >
      <VStack align="stretch" spacing={4}>
        <HStack justify="space-between">
          <Heading size="md" noOfLines={1}>{campaign.name}</Heading>
          <Badge colorScheme={statusColor[campaign.status]}>{campaign.status}</Badge>
        </HStack>
        
        <Text color="gray.600" noOfLines={2}>{campaign.description}</Text>
        
        <HStack spacing={4}>
          <HStack>
            <SafeIcon icon={FiCalendar} className="text-gray-500" />
            <Text fontSize="sm" color="gray.500">{campaign.startDate}</Text>
          </HStack>
          <HStack>
            <SafeIcon icon={FiUsers} className="text-gray-500" />
            <Text fontSize="sm" color="gray.500">{campaign.participants} participants</Text>
          </HStack>
        </HStack>
        
        <Box bg="gray.50" p={3} borderRadius="md">
          <HStack justify="space-between">
            <Text fontSize="sm" fontWeight="medium">Points Value:</Text>
            <Badge colorScheme="teal" fontSize="sm">{campaign.points} points</Badge>
          </HStack>
        </Box>
        
        <HStack spacing={2}>
          <Button
            size="sm"
            leftIcon={<SafeIcon icon={FiEdit2} />}
            onClick={() => onEdit(campaign)}
            colorScheme="teal"
            variant="outline"
            flex={1}
          >
            Edit
          </Button>
          <Button
            size="sm"
            leftIcon={<SafeIcon icon={FiTrash2} />}
            onClick={() => onDelete(campaign.id)}
            colorScheme="red"
            variant="ghost"
            flex={1}
          >
            Delete
          </Button>
        </HStack>
      </VStack>
    </MotionBox>
  );
};

const CampaignManager = () => {
  const [campaigns, setCampaigns] = useState([
    {
      id: 1,
      name: "Summer Sale Campaign",
      description: "Special discounts and bonus points for summer purchases",
      status: "Active",
      startDate: "2024-06-01",
      endDate: "2024-08-31",
      points: 500,
      participants: 145
    },
    {
      id: 2,
      name: "Back to School",
      description: "Earn extra points on school supplies and electronics",
      status: "Draft",
      startDate: "2024-08-15",
      endDate: "2024-09-15",
      points: 300,
      participants: 0
    }
  ]);

  const [editingCampaign, setEditingCampaign] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const handleEdit = (campaign) => {
    setEditingCampaign(campaign);
    onOpen();
  };

  const handleDelete = (campaignId) => {
    setCampaigns(campaigns.filter(c => c.id !== campaignId));
    toast({
      title: "Campaign Deleted",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleSave = (formData) => {
    if (editingCampaign) {
      setCampaigns(campaigns.map(c => 
        c.id === editingCampaign.id ? { ...c, ...formData } : c
      ));
    } else {
      setCampaigns([...campaigns, { id: Date.now(), ...formData, participants: 0 }]);
    }
    onClose();
    toast({
      title: editingCampaign ? "Campaign Updated" : "Campaign Created",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Box>
      <Box bg="teal.500" color="white" py={8}>
        <Container maxW="container.xl">
          <VStack spacing={4} align="stretch">
            <HStack justify="space-between">
              <Heading size="xl">Campaign Manager</Heading>
              <Button
                leftIcon={<SafeIcon icon={FiPlus} />}
                onClick={() => {
                  setEditingCampaign(null);
                  onOpen();
                }}
                colorScheme="whiteAlpha"
                size="lg"
              >
                New Campaign
              </Button>
            </HStack>
            <Text fontSize="lg">Create and manage your reward campaigns</Text>
          </VStack>
        </Container>
      </Box>

      <Container maxW="container.xl" py={8}>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {campaigns.map(campaign => (
            <CampaignCard
              key={campaign.id}
              campaign={campaign}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </SimpleGrid>

        <Modal isOpen={isOpen} onClose={onClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              {editingCampaign ? 'Edit Campaign' : 'Create New Campaign'}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Campaign Name</FormLabel>
                  <Input
                    defaultValue={editingCampaign?.name}
                    placeholder="Enter campaign name"
                  />
                </FormControl>
                
                <FormControl isRequired>
                  <FormLabel>Description</FormLabel>
                  <Input
                    defaultValue={editingCampaign?.description}
                    placeholder="Enter campaign description"
                  />
                </FormControl>
                
                <SimpleGrid columns={2} spacing={4} w="full">
                  <FormControl isRequired>
                    <FormLabel>Start Date</FormLabel>
                    <Input
                      type="date"
                      defaultValue={editingCampaign?.startDate}
                    />
                  </FormControl>
                  
                  <FormControl isRequired>
                    <FormLabel>End Date</FormLabel>
                    <Input
                      type="date"
                      defaultValue={editingCampaign?.endDate}
                    />
                  </FormControl>
                </SimpleGrid>
                
                <FormControl isRequired>
                  <FormLabel>Points Value</FormLabel>
                  <Input
                    type="number"
                    defaultValue={editingCampaign?.points}
                    placeholder="Enter points value"
                  />
                </FormControl>
                
                <FormControl isRequired>
                  <FormLabel>Status</FormLabel>
                  <Select defaultValue={editingCampaign?.status || 'Draft'}>
                    <option value="Draft">Draft</option>
                    <option value="Active">Active</option>
                    <option value="Paused">Paused</option>
                    <option value="Completed">Completed</option>
                  </Select>
                </FormControl>
              </VStack>
            </ModalBody>

            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="teal" onClick={() => handleSave({
                name: "New Campaign",
                description: "Campaign description",
                startDate: "2024-04-01",
                endDate: "2024-05-01",
                points: 100,
                status: "Draft"
              })}>
                {editingCampaign ? 'Update' : 'Create'}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Container>
    </Box>
  );
};

export default CampaignManager;