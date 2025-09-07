package com.iavtar.gfj_be.bootstrapper;

import com.iavtar.gfj_be.entity.AppUser;
import com.iavtar.gfj_be.entity.DashboardTab;
import com.iavtar.gfj_be.entity.Role;
import com.iavtar.gfj_be.entity.enums.DashboardTabs;
import com.iavtar.gfj_be.entity.enums.RoleType;
import com.iavtar.gfj_be.repository.AppUserRepository;
import com.iavtar.gfj_be.repository.DashboardRepository;
import com.iavtar.gfj_be.repository.RoleRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

@Slf4j
@Component
public class SystemBootstrapper implements CommandLineRunner {

    @Autowired
    private AppUserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private DashboardRepository dashboardRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        deploySystemRoles();
        deploySystemDashboards();
        createSuperAdmin();
        createShipper();
        createAccountant();
    }

    private void deploySystemRoles() {
        for (RoleType roleType : RoleType.values()) {
            Optional<Role> role = roleRepository.findByName(roleType);
            if (role.isEmpty()) {
                roleRepository.save(Role.builder().name(roleType).build());
            }
        }
    }

    private void deploySystemDashboards() {
        for (DashboardTabs dashboardTabs : DashboardTabs.values()) {
            Optional<DashboardTab> dashboardTab = dashboardRepository.findByName(dashboardTabs);
            if (dashboardTab.isEmpty()) {
                dashboardRepository.save(DashboardTab.builder().name(dashboardTabs).build());
            }
        }
    }

    private void createSuperAdmin() {
        // Deploy All Roles
        for (RoleType roleType : RoleType.values()) {
            Optional<Role> role = roleRepository.findByName(roleType);
            if (role.isEmpty()) {
                roleRepository.save(Role.builder().name(roleType).build());
            }
        }
        //Deploy All Dashboards
        for (DashboardTabs dashboardTabs : DashboardTabs.values()) {
            Optional<DashboardTab> dashboardTab = dashboardRepository.findByName(dashboardTabs);
            if (dashboardTab.isEmpty()) {
                dashboardRepository.save(DashboardTab.builder().name(dashboardTabs).build());
            }
        }
        //Create System Super Admin
        Optional<AppUser> user = userRepository.findByUsername("iavtar");
        if (user.isEmpty()) {
            Optional<Role> superAdminRole = roleRepository.findByName(RoleType.SUPER_ADMIN);
            Set<Role> superAdminRoles = new HashSet<>();
            superAdminRoles.add(superAdminRole.get());
            Optional<DashboardTab> superAdminDashboardTab = dashboardRepository.findByName(DashboardTabs.ADMINISTRATION);
            Set<DashboardTab> superAdminDashboardTabs = new HashSet<>();
            superAdminDashboardTabs.add(superAdminDashboardTab.get());
            userRepository.save(AppUser.builder().username("iavtar").firstName("System").lastName("Master").password(passwordEncoder.encode("12345"))
                    .email("admin@gmail.com").phoneNumber("1234567891").isActive(true).roles(superAdminRoles).dashboardTabs(superAdminDashboardTabs)
                    .build());
        }
    }

    private void createAccountant() {
        //Create Accountant
        Optional<AppUser> user = userRepository.findByUsername("gfj-accountant");
        if (user.isEmpty()) {
            Optional<Role> accountantRole = roleRepository.findByName(RoleType.ACCOUNTANT);
            Set<Role> accountantRoles = new HashSet<>();
            accountantRoles.add(accountantRole.get());
            Optional<DashboardTab> accountantDashboardTab1 = dashboardRepository.findByName(DashboardTabs.LEDGER);
            Optional<DashboardTab> accountantDashboardTab2 = dashboardRepository.findByName(DashboardTabs.CHAT);
            Set<DashboardTab> shipperDashboardTabs = new HashSet<>();
            shipperDashboardTabs.add(accountantDashboardTab1.get());
            shipperDashboardTabs.add(accountantDashboardTab2.get());
            userRepository.save(AppUser.builder().username("gfj-accountant").firstName("gfj").lastName("shipper").password(passwordEncoder.encode("gfj-accountant12345!"))
                    .email("gfj-accountant@gmail.com").phoneNumber("1234567892").isActive(true).roles(accountantRoles).dashboardTabs(shipperDashboardTabs)
                    .build());
        }
    }

    private void createShipper() {
        //Create Shipper
        Optional<AppUser> user = userRepository.findByUsername("gfj-shipper");
        if (user.isEmpty()) {
            Optional<Role> shipperRole = roleRepository.findByName(RoleType.SHIPPER);
            Set<Role> shipperRoles = new HashSet<>();
            shipperRoles.add(shipperRole.get());
            Optional<DashboardTab> shipperDashboardTab1 = dashboardRepository.findByName(DashboardTabs.SHIPPING);
            Optional<DashboardTab> shipperDashboardTab2 = dashboardRepository.findByName(DashboardTabs.CHAT);
            Set<DashboardTab> shipperDashboardTabs = new HashSet<>();
            shipperDashboardTabs.add(shipperDashboardTab1.get());
            shipperDashboardTabs.add(shipperDashboardTab2.get());
            userRepository.save(AppUser.builder().username("gfj-shipper").firstName("gfj").lastName("shipper").password(passwordEncoder.encode("gfj-shipper12345!"))
                    .email("gfj-shipper@gmail.com").phoneNumber("1234567893").isActive(true).roles(shipperRoles).dashboardTabs(shipperDashboardTabs)
                    .build());
        }
    }

}
