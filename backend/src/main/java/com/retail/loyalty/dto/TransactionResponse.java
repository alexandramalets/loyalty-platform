package com.retail.loyalty.dto;

public record TransactionResponse(
        String id,
        String participantId,
        String participantName,
        int amount,
        String type,
        String date,
        String reason,
        String status,
        String event
) {
}
