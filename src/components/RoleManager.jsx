import React from 'react';
import {
  Box,
  Container,
  Heading,
  VStack,
  Select,
  Text,
  List,
  ListItem,
  ListIcon,
  Badge
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { Roles, RolePermissions } from '../models/RoleModel';
import SafeIcon from '../common/SafeIcon';

const { FiCheck, FiShield } = FiIcons;

const MotionBox = motion(Box);

const RoleManager = () => {
  const { user, updateRole, hasPermission } = useAuth();

  const handleRoleChange = (e) => {
    updateRole(e.target.value);
  };

  return (
    <Container maxW="container.xl" p={8}>
      <VStack spacing={8} align="stretch">
        <Heading size="xl" color="teal.600">Role Management</Heading>
        
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          bg="white"
          p={6}
          borderRadius="lg"
          shadow="md"
        >
          <VStack spacing={4} align="stretch">
            <Box>
              <Text mb={2} fontWeight="bold">Current Role</Text>
              <Select value={user.role} onChange={handleRoleChange}>
                {Object.values(Roles).map(role => (
                  <option key={role} value={role}>
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </option>
                ))}
              </Select>
            </Box>

            <Box>
              <Text mb={2} fontWeight="bold">Role Permissions</Text>
              <List spacing={3}>
                {RolePermissions[user.role]?.map(permission => (
                  <ListItem key={permission}>
                    <ListIcon as={FiCheck} color="green.500" />
                    {permission.split('_').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')}
                  </ListItem>
                ))}
              </List>
            </Box>

            <Box p={4} bg="gray.50" borderRadius="md">
              <HStack spacing={2}>
                <SafeIcon icon={FiShield} className="text-teal-500" />
                <Text fontWeight="bold">Access Level:</Text>
                <Badge colorScheme={
                  user.role === Roles.ADMIN ? "red" :
                  user.role === Roles.MANAGER ? "purple" :
                  "green"
                }>
                  {user.role.toUpperCase()}
                </Badge>
              </HStack>
            </Box>
          </VStack>
        </MotionBox>
      </VStack>
    </Container>
  );
};

export default RoleManager;