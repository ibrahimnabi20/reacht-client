/**
 * SubscriptionCard Component
 * Displays a single subscription with its details and actions (Renew, Delete)
 *
 * @param {Object} subscription - The subscription object to display
 * @param {Function} onRenew - Function to handle renewing a subscription
 * @param {Function} onDelete - Function to handle deleting a subscription
 */

import React from "react";
import { Card, CardContent, Typography, Button, CardActions } from "@mui/material";

const SubscriptionCard = ({ subscription, onRenew, onDelete }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6">{subscription.service}</Typography>
        <Typography>
          Expires: {new Date(subscription.endDate).toLocaleDateString()}
        </Typography>
      </CardContent>
      <CardActions>
        <Button color="primary" onClick={() => onRenew(subscription._id)}>
          Renew
        </Button>
        <Button color="error" onClick={() => onDelete(subscription._id)}>
          Delete
        </Button>
      </CardActions>
    </Card>
  );
};

export default SubscriptionCard;
