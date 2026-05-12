package com.bmtest.finalgithub.controller;

import com.bmtest.finalgithub.base.controller.AttachmentBaseController;
import com.bmtest.finalgithub.service.AttachmentServiceImpl;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = "/rest/attachments/", produces = "application/json")
public class AttachmentController extends AttachmentBaseController {
  public AttachmentController(AttachmentServiceImpl attachmentService) {
    super(attachmentService);
  }
}
