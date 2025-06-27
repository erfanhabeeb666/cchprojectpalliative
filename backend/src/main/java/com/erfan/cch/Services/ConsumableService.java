package com.erfan.cch.Services;

import com.erfan.cch.Dto.ConsumableDto;
import com.erfan.cch.Dto.ConsumableAdjustment;
import com.erfan.cch.Models.Consumable;
import com.erfan.cch.Repo.ConsumableRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ConsumableService {

    private final ConsumableRepository repo;

    public List<ConsumableDto> findAll() {
        return repo.findAll().stream()
                .map(c -> new ConsumableDto(c.getId(), c.getName(), c.getQuantity()))
                .collect(Collectors.toList());
    }

    public ConsumableDto create(String name, int qty) {
        Consumable c = new Consumable();
        c.setName(name.trim());
        c.setQuantity(Math.max(qty, 0));
        repo.save(c);
        return new ConsumableDto(c.getId(), c.getName(), c.getQuantity());
    }

    /** Adjust stock in one transaction */
    @Transactional
    public void adjustQuantity(Long id, int delta) {
        repo.findById(id).ifPresent(c -> {
            int newQty = Math.max(c.getQuantity() + delta, 0);
            c.setQuantity(newQty);
        });
    }


    @Transactional
    public void applyAdjustments(List<ConsumableAdjustment> list) {
        for (ConsumableAdjustment a : list) {
            adjustQuantity(a.getConsumableId(), a.getDelta());
        }
    }
}
