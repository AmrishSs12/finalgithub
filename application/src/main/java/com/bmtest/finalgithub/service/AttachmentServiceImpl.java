package com.bmtest.finalgithub.service;

import com.rappit.rd.base.attachment.repository.IAttachmentRepository;
import com.rappit.rd.base.files.AttachmentService;
import org.springframework.stereotype.Service;

@Service("attachmentservice")
public class AttachmentServiceImpl extends AttachmentService {
  public AttachmentServiceImpl(IAttachmentRepository repository) {
    super(repository);
  }
}
