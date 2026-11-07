package com.retail.loyalty.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.retail.loyalty.domain.LoyaltyLevel;
import com.retail.loyalty.domain.Promotion;
import com.retail.loyalty.dto.PromotionRequest;
import com.retail.loyalty.dto.PromotionResponse;
import com.retail.loyalty.exception.BadRequestException;
import com.retail.loyalty.exception.NotFoundException;
import com.retail.loyalty.mapper.DateMapper;
import com.retail.loyalty.mapper.PromotionMapper;
import com.retail.loyalty.repository.PromotionRepository;

@Service
@Transactional
public class PromotionService {

    private final PromotionRepository promotions;
    private final LoyaltyLevelService levels;
    private final PromotionMapper mapper;
    private final DateMapper dates;
    private final CodeGenerator codes;

    public PromotionService(
            PromotionRepository promotions,
            LoyaltyLevelService levels,
            PromotionMapper mapper,
            DateMapper dates,
            CodeGenerator codes
    ) {
        this.promotions = promotions;
        this.levels = levels;
        this.mapper = mapper;
        this.dates = dates;
        this.codes = codes;
    }

    @Transactional(readOnly = true)
    public List<PromotionResponse> findAll() {
        return promotions.findAllByOrderByStartDateDesc().stream().map(mapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public PromotionResponse find(String id) {
        return mapper.toResponse(require(id));
    }

    public PromotionResponse create(PromotionRequest request) {
        Promotion promotion = new Promotion();
        promotion.setId(codes.nextPromotionId());
        apply(promotion, request);
        return mapper.toResponse(promotions.save(promotion));
    }

    public PromotionResponse update(String id, PromotionRequest request) {
        Promotion promotion = require(id);
        apply(promotion, request);
        return mapper.toResponse(promotions.save(promotion));
    }

    public void delete(String id) {
        promotions.delete(require(id));
    }

    private Promotion require(String id) {
        return promotions.findById(id)
                .orElseThrow(() -> new NotFoundException("Акция не найдена: " + id));
    }

    private void apply(Promotion promotion, PromotionRequest request) {
        LocalDate start = dates.parse(request.start(), "start");
        LocalDate end = dates.parse(request.end(), "end");
        if (start.isAfter(end)) {
            throw new BadRequestException("Дата начала не может быть позже даты окончания");
        }
        promotion.setName(request.name().trim());
        promotion.setStatus(request.status());
        promotion.setStartDate(start);
        promotion.setEndDate(end);
        promotion.setBonusValue(BigDecimal.valueOf(request.bonusPercent()));
        promotion.setDescription(request.description() == null ? "" : request.description().trim());
        String levelId = request.levelId();
        if (levelId == null || levelId.isBlank() || "all".equals(levelId)) {
            promotion.setLevel(null);
        } else {
            LoyaltyLevel level = levels.require(levelId);
            promotion.setLevel(level);
        }
    }
}
