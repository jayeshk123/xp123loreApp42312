//
//  DealsCell.swift
//  TestWV
//
//  Created by earth on 09/10/17.
//  Copyright © 2017 earth. All rights reserved.
//

import UIKit

class DealsCell: UITableViewCell {
    var isObserving = false;
    @IBOutlet weak var backView: UIView!
    @IBOutlet weak var titleLabel: UILabel!
    @IBOutlet weak var dateImage: UIImageView!
    @IBOutlet weak var addressImage: UIImageView!
    @IBOutlet weak var addressLabel: UILabel!
    @IBOutlet weak var dateLabel: UILabel!
    @IBOutlet weak var mainContent: UITextView!
    @IBOutlet weak var bottomImage: UIImageView!
    @IBOutlet weak var upButton: UIButton!
    @IBOutlet weak var mainImage: UIImageView!
    @IBOutlet weak var buyNowBtn: UIButton!
    class var expandedHeight: CGFloat { get { return 565.0 } }
    class var defaultHeight: CGFloat  { get { return 465.0  } }
    override func awakeFromNib() {
        super.awakeFromNib()
        // Initialization code
    }

    override func setSelected(_ selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)
        buyNowBtn.layer.cornerRadius = 15
        // Configure the view for the selected state
    }
    
    func checkHeight() {
        //mainContent.isHidden = (frame.size.height < DealsCell.expandedHeight)
        buyNowBtn.isHidden = (frame.size.height < DealsCell.expandedHeight)
        
    }
    
    func watchFrameChanges() {
        if !isObserving {
            addObserver(self, forKeyPath: "frame", options: [NSKeyValueObservingOptions.new, NSKeyValueObservingOptions.initial], context: nil)
            isObserving = true;
        }
    }
    
    func ignoreFrameChanges() {
        if isObserving {
            removeObserver(self, forKeyPath: "frame")
            isObserving = false;
        }
    }
    
    override func observeValue(forKeyPath keyPath: String?, of object: Any?, change: [NSKeyValueChangeKey : Any]?, context: UnsafeMutableRawPointer?) {
        if keyPath == "frame" {
            checkHeight()
        }
    }
    
}
