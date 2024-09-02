    package com.example.aocv_back.repository.item;

    import com.example.aocv_back.entity.item.Item;
    import org.springframework.data.domain.Page;
    import org.springframework.data.domain.Pageable;
    import org.springframework.data.jpa.repository.JpaRepository;

    public interface ItemRepository extends JpaRepository<Item, Integer>,ItemRepositoryCustom {

    }
