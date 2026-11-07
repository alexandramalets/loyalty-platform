package com.retail.loyalty.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.retail.loyalty.domain.LoyaltyLevel;
import com.retail.loyalty.dto.LoyaltyLevelRequest;
import com.retail.loyalty.dto.LoyaltyLevelResponse;
import com.retail.loyalty.exception.BadRequestException;
import com.retail.loyalty.exception.ConflictException;
import com.retail.loyalty.exception.NotFoundException;
import com.retail.loyalty.mapper.DateMapper;
import com.retail.loyalty.mapper.LoyaltyLevelMapper;
import com.retail.loyalty.repository.CustomerRepository;
import com.retail.loyalty.repository.LoyaltyAccountRepository;
import com.retail.loyalty.repository.LoyaltyLevelRepository;
import com.retail.loyalty.repository.PromotionRepository;

@Service
@Transactional
public class LoyaltyLevelService {

    private static final String[] PALETTE = {"#C5D1C3", "#8FA88F", "#4F7A62", "#174D3A"};

    private final LoyaltyLevelRepository levels;
    private final CustomerRepository customers;
    private final LoyaltyAccountRepository accounts;
    private final PromotionRepository promotions;
    private final LoyaltyLevelMapper mapper;
    private final DateMapper dates;
    private final CodeGenerator codes;

    public LoyaltyLevelService(
            LoyaltyLevelRepository levels,
            CustomerRepository customers,
            LoyaltyAccountRepository accounts,
            PromotionRepository promotions,
            LoyaltyLevelMapper mapper,
            DateMapper dates,
            CodeGenerator codes
    ) {
        this.levels = levels;
        this.customers = customers;
        this.accounts = accounts;
        this.promotions = promotions;
        this.mapper = mapper;
        this.dates = dates;
        this.codes = codes;
    }

    @Transactional(readOnly = true)
    public List<LoyaltyLevelResponse> findAll() {
        return levels.findAllByOrderByThresholdPointsAsc().stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public LoyaltyLevelResponse find(String id) {
        return toResponse(require(id));
    }

    public LoyaltyLevelResponse create(LoyaltyLevelRequest request) {
        validateUniqueness(null, request);
        LoyaltyLevel level = new LoyaltyLevel();
        level.setId(codes.nextLevelId());
        apply(level, request, PALETTE[Math.floorMod((int) levels.count(), PALETTE.length)]);
        return toResponse(levels.save(level));
    }

    public LoyaltyLevelResponse update(String id, LoyaltyLevelRequest request) {
        LoyaltyLevel level = require(id);
        validateUniqueness(id, request);
        apply(level, request, level.getColor());
        return toResponse(levels.save(level));
    }

    public void delete(String id) {
        LoyaltyLevel level = require(id);
        if (accounts.existsByLevelId(id) || promotions.existsByLevelId(id)) {
            throw new ConflictException("Нельзя удалить уровень, который используется участниками или акциями");
        }
        levels.delete(level);
    }

    public LoyaltyLevel require(String id) {
        return levels.findById(id)
                .orElseThrow(() -> new NotFoundException("Уровень лояльности не найден: " + id));
    }

    public LoyaltyLevel resolveForPoints(int points) {
        return levels.findFirstByThresholdPointsLessThanEqualOrderByThresholdPointsDesc(points)
                .orElseThrow(() -> new BadRequestException("В программе нет уровня для " + points + " баллов"));
    }

    private void apply(LoyaltyLevel level, LoyaltyLevelRequest request, String fallbackColor) {
        level.setName(request.name().trim());
        level.setThresholdPoints(request.points());
        level.setAccrualPercent(request.percent());
        level.setColor(request.color() == null || request.color().isBlank() ? fallbackColor : request.color());
        level.setEffectiveFrom(dates.parse(request.effectiveFrom(), "effectiveFrom"));
        level.setDescription(request.description() == null ? "" : request.description().trim());
    }

    private void validateUniqueness(String id, LoyaltyLevelRequest request) {
        boolean duplicateName = id == null
                ? levels.existsByNameIgnoreCase(request.name().trim())
                : levels.existsByNameIgnoreCaseAndIdNot(request.name().trim(), id);
        if (duplicateName) {
            throw new ConflictException("Уровень с таким названием уже существует");
        }
        boolean duplicatePoints = id == null
                ? levels.existsByThresholdPoints(request.points())
                : levels.existsByThresholdPointsAndIdNot(request.points(), id);
        if (duplicatePoints) {
            throw new ConflictException("Порог перехода должен отличаться от порогов других уровней");
        }
    }

    private LoyaltyLevelResponse toResponse(LoyaltyLevel level) {
        return mapper.toResponse(level, customers.countByAccount_Level_Id(level.getId()));
    }
}
