//
//  NewsCell.swift
//  TestWV
//
//  Created by earth on 09/10/17.
//  Copyright © 2017 earth. All rights reserved.
//

import UIKit

class NewsCell: UITableViewCell {

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
    override func awakeFromNib() {
        super.awakeFromNib()
        // Initialization code
    }

    override func setSelected(_ selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)
        buyNowBtn.layer.cornerRadius = 15
        // Configure the view for the selected state
    }
    
}
