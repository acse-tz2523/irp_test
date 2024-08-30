<!--
Author: Tianzi Zhang
GitHub: acse-tz2523
-->
<template>
  <el-container style="height: 100vh;">
    <!-- Header -->
    <el-header style="background-color: #FAFAFA; color:black ; display: flex; align-items: center; justify-content: space-between; font-weight: bold;">
      <div>
        <el-icon style="margin-right: 10px;"><Menu /></el-icon>
        Global CCS Visualization
      </div>
    </el-header>

    <el-container>
      <!-- Sidebar -->
      <el-aside width="200px" style="background-color: #F0F2F5;">
        <el-menu
          :default-active="activeIndex"
          class="el-menu-vertical-demo"
          background-color="#F0F2F5"
          text-color=black
          active-text-color="#337ecc"
          @select="handleSelect"
          @open="handleOpen"
          @close="handleClose"
        >
          <!-- Introduction Category -->
          <el-sub-menu index="1">
            <template #title>
              <el-icon><Document /></el-icon>
              <span>Introduction</span>
            </template>
            <el-menu-item index="introduction">Overview</el-menu-item>
          </el-sub-menu>

          <!-- Data Analysis Category -->
          <el-sub-menu index="2">
            <template #title>
              <el-icon><Management /></el-icon>
              <span>Data Analysis</span>
            </template>
            <el-menu-item index="map">
              <el-icon><Location /></el-icon>
              Map
            </el-menu-item>
            <el-menu-item index="histogram">
              <el-icon><PictureRounded /></el-icon>
              Histogram
            </el-menu-item>
            <el-menu-item index="boxplot">
              <el-icon><PictureRounded /></el-icon>
              Boxplot
            </el-menu-item>
            <el-menu-item index="animation">
              <el-icon><PictureRounded /></el-icon>
              Animation
            </el-menu-item>
          </el-sub-menu>

          <!-- Upload Category -->
          <el-sub-menu index="3">
            <template #title>
              <el-icon><Link /></el-icon>
              <span>Upload</span>
            </template>
            <el-menu-item index="upload">Upload Files</el-menu-item>
          </el-sub-menu>
        </el-menu>
      </el-aside>

      <!-- Main Content Area -->
      <el-main style="background-color:#EBEDF0;">
        <router-view/>
      </el-main>
    </el-container>

    <!-- Footer -->
    <el-footer style="background-color: #FAFAFA; color: black; text-align: center; line-height: 60px;">
      Imperial ESE © 2024
    </el-footer>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      // Track the active menu item using localStorage for persistence
      activeIndex: localStorage.getItem('activeIndex') || 'introduction',
    };
  },
  methods: {
    // Handle menu item selection, update active index, and navigate to the corresponding route
    handleSelect(index) {
      this.activeIndex = index;
      localStorage.setItem('activeIndex', index);
      this.$router.push(`/${index}`);
    },
    // Log when a submenu is opened
    handleOpen(key, keyPath) {
      console.log('open:', key, keyPath);
    },
    // Log when a submenu is closed
    handleClose(key, keyPath) {
      console.log('close:', key, keyPath);
    },
  },
};
</script>

<style>
/* Style for the header and footer */
.el-header, .el-footer {
  line-height: 60px;
}

/* Style for the sidebar text color */
.el-aside {
  color: #fff;
}

/* Remove border on the right side of the menu */
.el-menu-vertical-demo:not(.el-menu--collapse) {
  border-right: 0;
}

/* Ensure menu items have consistent height */
.el-menu-item {
  height: 60px;
  line-height: 60px;
}

/* Add padding to the main content area */
.el-main {
  padding: 20px;
}

/* Add margin to icons for spacing */
.el-icon {
  margin-right: 10px;
}

/* Hide the scrollbar in the main content area */
.el-main::-webkit-scrollbar {
  display: none;
}
</style>
