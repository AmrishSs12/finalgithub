package com.bmtest.finalgithub.base.controller;

import com.rappit.rd.base.attachment.model.EvaAttachment;
import com.rappit.rd.base.attachment.model.FileDownloadInfo;
import com.rappit.rd.base.attachment.model.FileInfo;
import com.rappit.rd.base.attachment.model.FileUploadInfo;
import com.rappit.rd.base.controller.BaseController;
import com.rappit.rd.base.exception.InternalException;
import com.rappit.rd.base.files.AttachmentService;
import com.rappit.rd.base.logger.Logger;
import com.rappit.rd.base.logger.LoggerFactory;
import com.rappit.rd.base.model.EvaAttachmentResponse;
import com.rappit.rd.base.util.ErrorCode;
import jakarta.ws.rs.core.HttpHeaders;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;

public class AttachmentBaseController extends BaseController<EvaAttachment, EvaAttachment> {

  private static final Logger logger = LoggerFactory.getLogger(AttachmentBaseController.class);
  protected AttachmentService service;

  public AttachmentBaseController(AttachmentService service) {
    super(service);
    this.service = Objects.requireNonNull(service, ErrorCode.SERVICE_MUST_NOT_BE_NULL);
  }

  @PostMapping(path = "/upload")
  public List<EvaAttachmentResponse> upload(
      @RequestPart("files") MultipartFile[] multipartFileArray,
      @RequestParam("modelKey") String modelKey,
      @RequestParam("fieldName") String fieldName,
      @RequestParam(name = "fileDesc", required = false) String fileDesc) {
    logger.logEntry("upload", multipartFileArray, modelKey, fieldName, fileDesc);
    FileUploadInfo fileUploadInfo =
        buildFileUploadInfo(multipartFileArray, modelKey, fieldName, fileDesc);
    List<EvaAttachmentResponse> response = service.upload(fileUploadInfo);
    logger.logExit("upload", response);
    return response;
  }

  /** Builds FileUploadInfo from multipart files and parameters. */
  private FileUploadInfo buildFileUploadInfo(
      MultipartFile[] multipartFileArray, String modelKey, String fieldName, String fileDesc) {
    if (multipartFileArray == null) {
      logger.info("The file content is empty or null.");
      throw new InternalException("The file content is empty or null.");
    }
    try {
      FileUploadInfo fileUploadInfo = new FileUploadInfo();
      fileUploadInfo.setModelKey(fileDesc);
      fileUploadInfo.setFieldName(fieldName);
      fileUploadInfo.setFileDesc(fileDesc);
      List<FileInfo> fileInfo = new ArrayList<>(multipartFileArray.length);
      for (int i = 0; i < multipartFileArray.length; i++) {
        fileInfo.add(
            new FileInfo(
                multipartFileArray[i].getInputStream(),
                multipartFileArray[i].getOriginalFilename()));
      }
      fileUploadInfo.setFileInfo(fileInfo);
      return fileUploadInfo;
    } catch (IOException e) {
      logger.error("An error occurred while processing the file.");
      throw new InternalException("An error occurred while processing the file.", e);
    }
  }

  @GetMapping(path = "/download/attachment/{attachment_id}", produces = "application/octet-stream")
  public ResponseEntity<Resource> downloadAsAttachment(
      @PathVariable("attachment_id") String attachmentId) {
    logger.logEntry("downloadAsAttachment", attachmentId);
    try {
      FileDownloadInfo fileDownloadInfo = service.download(attachmentId);

      if (fileDownloadInfo != null && fileDownloadInfo.getInputStream() != null) {
        InputStreamResource resource = new InputStreamResource(fileDownloadInfo.getInputStream());
        return ResponseEntity.ok()
            .header(
                "content-disposition", "attachment; filename = " + fileDownloadInfo.getFileName())
            .body(resource);
      } else {
        return ResponseEntity.notFound().build();
      }
    } catch (Exception e) {
      logger.error("Exception occurred in downloading the attachment with id:" + attachmentId);
      return ResponseEntity.notFound().build();
    } finally {
      logger.info("Leaving downloadAsAttachment ...");
    }
  }

  @GetMapping(path = "/download/inline/{attachment_id}", produces = "application/octet-stream")
  public ResponseEntity<Resource> downloadAsInline(
      @PathVariable("attachment_id") String attachmentId) {
    logger.logEntry("downloadAsInline", attachmentId);
    try {
      FileDownloadInfo fileDownloadInfo = service.download(attachmentId);

      if (fileDownloadInfo != null && fileDownloadInfo.getInputStream() != null) {
        InputStreamResource resource = new InputStreamResource(fileDownloadInfo.getInputStream());
        return ResponseEntity.ok()
            .header("content-disposition", "inline; filename = " + fileDownloadInfo.getFileName())
            .body(resource);
      } else {
        return ResponseEntity.notFound().build();
      }
    } catch (Exception e) {
      logger.error(
          "Exception occurred in downloading the attachment as inline with id:" + attachmentId);
      return ResponseEntity.notFound().build();
    } finally {
      logger.info("Leaving downloadAsInline ...");
    }
  }

  @GetMapping(path = "/download/template/{fileName}", produces = "application/octet-stream")
  public ResponseEntity<InputStreamResource> downloadTemolate(
      @PathVariable("fileName") String fileName) throws IOException {
    ClassPathResource fileResource = new ClassPathResource("importtemplates/" + fileName);
    if (!fileResource.exists()) {
      return ResponseEntity.notFound().build();
    }

    return ResponseEntity.ok()
        .header(
            HttpHeaders.CONTENT_DISPOSITION,
            "attachment; filename=\"" + fileResource.getFilename() + "\"")
        .body(new InputStreamResource(fileResource.getInputStream()));
  }

  @GetMapping("/all/{modelKey}")
  public List<EvaAttachment> getAllByModelKey(@PathVariable("modelKey") String modelKey) {
    logger.logEntry("getAllByModelKey", modelKey);
    List<EvaAttachment> attachments = service.getAllByModelKey(modelKey);
    logger.logExit("getAllByModelKey", attachments);
    return attachments;
  }

  @PostMapping("/link")
  public EvaAttachmentResponse addLink(@RequestBody EvaAttachment linkAttachment) {
    logger.logEntry("addLink", linkAttachment);
    EvaAttachmentResponse evaAttachmentResponse = service.addLink(linkAttachment);
    logger.logExit("addLink", evaAttachmentResponse);
    return evaAttachmentResponse;
  }

  @DeleteMapping("/{ids}")
  public ResponseEntity<EvaAttachment> deleteRecords(@PathVariable("ids") String ids) {
    logger.logEntry("deleteRecords", ids);
    boolean isDeleted = service.delete(ids);
    ResponseEntity<EvaAttachment> response;
    if (isDeleted) response = ResponseEntity.ok().build();
    else response = ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    logger.logExit("deleteRecords", response);
    return response;
  }
}
