<template>
  <div>
    <!-- Scenario Selection -->
    <el-form>
      <el-form-item label="Which Scenario do you want to Update?">
        <el-radio-group v-model="selectedScenario">
          <el-radio label="R_S1">Reference</el-radio>
          <el-radio label="R_S2">Minimum</el-radio>
          <el-radio label="R_S3">Maximum</el-radio>
          <el-radio label="R_S4">Growth 10%</el-radio>
          <el-radio label="US1Gt">US1Gt</el-radio>
          <el-radio label="EUUSChina">EUUSChina</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>

    <!-- File Upload -->
    <el-upload
      ref="upload"
      :data="{ scenario: selectedScenario }"
      :file-list="fileList"
      class="upload-demo"
      action="http://localhost:8080/upload"
      :limit="1"
      accept=".xlsx,.xls,.csv"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :before-remove="beforeRemove"
      :on-change="handleChange"
      :before-upload="beforeUpload"
      :on-success="handleSuccess"
      :on-error="handleError"
      list-type="text"
      :show-file-list="false" 
    >
      <el-button type="primary">Click to upload</el-button>
      <template #tip>
        <div class="el-upload__tip">
          Only one Excel or CSV file is allowed. The file should include the following columns: Country, Growth, Storage, Rate, Global.
        </div>
      </template>
    </el-upload>
  </div>
</template>

<script>
import { ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';

export default {
  name: 'UploadFile',

  setup() {
    const selectedScenario = ref('R_S1');
    const fileList = ref([]);

    /**
     * Handle file preview
     * @param {Object} file - The file object to be previewed.
     */
    const handlePreview = (file) => {
      console.log('Preview file:', file);
    };

    /**
     * Handle file removal
     * @param {Object} file - The file object to be removed.
     */
    const handleRemove = (file) => {
      console.log('Removed file:', file);
    };

    /**
     * Confirm before removing a file
     * @param {Object} file - The file object to be removed.
     * @returns {Promise<boolean>} - Confirmation result.
     */
    const beforeRemove = (file) => {
      return ElMessageBox.confirm(`Are you sure you want to remove ${file.name}?`)
        .then(() => {
          console.log('File removal confirmed:', file.name);
          return true;
        })
        .catch(() => {
          console.log('File removal canceled:', file.name);
          return false;
        });
    };

    /**
     * Handle file change
     * @param {Object} file - The current file object.
     * @param {Array} fileList - The list of all selected files.
     */
    const handleChange = (file, fileList) => {
      console.log('File list changed:', file, fileList);
    };

    /**
     * Check before uploading a file
     * @param {Object} file - The file object to be uploaded.
     * @returns {boolean} - Whether the file is valid for upload.
     */
    const beforeUpload = (file) => {
      const isExcelOrCsv = file.type === 'application/vnd.ms-excel' ||
                           file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
                           file.type === 'text/csv';

      if (!isExcelOrCsv) {
        ElMessage.error('Only Excel or CSV files are allowed.');
        console.log('Invalid file type:', file.type);
        return false;
      }

      console.log('File ready for upload:', file.name);
      return true;
    };

    /**
     * Handle upload success
     * @param {Object} response - The response object from the server.
     */
    const handleSuccess = (response) => {
      ElMessage.success(response.message);  // Display the success message returned by the server
      console.log('Upload success:', response);
      fileList.value = [];  // Reset file list to ensure the next upload triggers correctly
    };

    /**
     * Handle upload error
     * @param {Object} err - The error object returned during the upload.
     */
    const handleError = (err) => {
      ElMessage.error(err.response?.data?.message || 'Failed to upload file. Please try again.');  // Display the error message returned by the server
      console.error('Upload error:', err);
      // Do not reset fileList, allowing the user to modify and re-upload
    };

    return {
      selectedScenario,
      fileList,
      handlePreview,
      handleRemove,
      beforeRemove,
      handleChange,
      beforeUpload,
      handleSuccess,
      handleError,
    };
  },
};
</script>

<style scoped>
.upload-demo {
  margin-top: 20px;
}
</style>
